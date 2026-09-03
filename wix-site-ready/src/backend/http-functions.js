import { ok, badRequest, serverError } from 'wix-http-functions';
import wixData from 'wix-data';
import { files } from '@wix/media';
import { auth } from '@wix/essentials';

const OWNER = { suppressAuth: true };
const elevatedGenerateFileUploadUrl = auth.elevate(files.generateFileUploadUrl);

const COLLECTIONS = {
  recipes: 'DMRecipes',
  sections: 'DMSections',
  components: 'DMComponents',
  ingredients: 'DMIngredients',
  preparations: 'DMPreparations'
};

const IMAGE_TARGETS = {
  recipe: { collection: COLLECTIONS.recipes, field: 'heroImage' },
  ingredient: { collection: COLLECTIONS.ingredients, field: 'baseImage' },
  preparation: { collection: COLLECTIONS.preparations, field: 'image' }
};

function json(builder, body) {
  return builder({
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0'
    },
    body: JSON.stringify(body)
  });
}

async function bodyOf(request) {
  try { return await request.body.json(); }
  catch (_) { return {}; }
}

function clean(value, max = 300) {
  return String(value == null ? '' : value).trim().slice(0, max);
}

async function loadAll(collectionId) {
  let result = await wixData.query(collectionId).limit(1000).find(OWNER);
  const items = [...result.items];
  while (result.hasNext()) {
    result = await result.next();
    items.push(...result.items);
  }
  return items;
}

export async function get_dmMenuData() {
  try {
    const [recipes, sections, components, ingredients, preparations] = await Promise.all([
      loadAll(COLLECTIONS.recipes),
      loadAll(COLLECTIONS.sections),
      loadAll(COLLECTIONS.components),
      loadAll(COLLECTIONS.ingredients),
      loadAll(COLLECTIONS.preparations)
    ]);
    return json(ok, { ok: true, recipes, sections, components, ingredients, preparations });
  } catch (error) {
    return json(serverError, { ok: false, error: clean(error?.message || error, 1500) });
  }
}

export async function post_dmUploadUrl(request) {
  try {
    const body = await bodyOf(request);
    const requestId = clean(body.requestId, 120);
    const fileName = clean(body.fileName, 300) || `photo-${Date.now()}.jpg`;
    const mimeType = clean(body.mimeType, 100).toLowerCase();
    const entityType = clean(body.entityType, 40).toLowerCase();
    const entityId = clean(body.entityId, 200);
    const sizeInBytes = Number(body.sizeInBytes || 0);
    const target = IMAGE_TARGETS[entityType];

    if (!requestId || !target || !entityId || !mimeType.startsWith('image/')) {
      return json(badRequest, { ok: false, error: 'INVALID_UPLOAD_REQUEST' });
    }
    if (!Number.isFinite(sizeInBytes) || sizeInBytes <= 0 || sizeInBytes > 10 * 1024 * 1024) {
      return json(badRequest, { ok: false, error: 'IMAGE_TOO_LARGE_OR_INVALID' });
    }

    const entity = await wixData.get(target.collection, entityId, OWNER);
    if (!entity?._id) return json(badRequest, { ok: false, error: 'ENTITY_NOT_FOUND' });

    const result = await elevatedGenerateFileUploadUrl(mimeType, {
      fileName,
      private: false,
      labels: ['nexo-dynamic-menu', entityType, entityId]
    });

    return json(ok, {
      ok: true,
      requestId,
      entityType,
      entityId,
      uploadUrl: result.uploadUrl
    });
  } catch (error) {
    return json(serverError, { ok: false, error: clean(error?.message || error, 1500) });
  }
}

export async function post_dmSaveImage(request) {
  try {
    const body = await bodyOf(request);
    const requestId = clean(body.requestId, 120);
    const entityType = clean(body.entityType, 40).toLowerCase();
    const entityId = clean(body.entityId, 200);
    const target = IMAGE_TARGETS[entityType];
    const source = body.image || {};
    const image = {
      id: clean(source.id, 500),
      url: clean(source.url, 1500),
      height: Math.max(0, Number(source.height || 0)),
      width: Math.max(0, Number(source.width || 0)),
      altText: clean(source.altText, 500)
    };

    if (!requestId || !target || !entityId || !image.id || !image.url.startsWith('https://static.wixstatic.com/media/')) {
      return json(badRequest, { ok: false, error: 'INVALID_IMAGE_SAVE_REQUEST' });
    }

    const item = await wixData.get(target.collection, entityId, OWNER);
    if (!item?._id) return json(badRequest, { ok: false, error: 'ENTITY_NOT_FOUND' });

    item[target.field] = image;
    item.imageUpdatedAt = new Date();
    const saved = await wixData.update(target.collection, item, OWNER);

    return json(ok, {
      ok: true,
      requestId,
      entityType,
      entityId,
      image: saved[target.field]
    });
  } catch (error) {
    return json(serverError, { ok: false, error: clean(error?.message || error, 1500) });
  }
}
