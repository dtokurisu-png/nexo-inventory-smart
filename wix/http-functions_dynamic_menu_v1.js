import wixData from 'wix-data';
import { ok, badRequest, serverError } from 'wix-http-functions';
import { files } from '@wix/media';
import { auth } from '@wix/essentials';

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

const cors = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store'
};

const jsonOk = body => ok({ headers: cors, body: JSON.stringify({ ok: true, ...body }) });
const jsonBad = message => badRequest({ headers: cors, body: JSON.stringify({ ok: false, error: message }) });
const jsonError = error => serverError({ headers: cors, body: JSON.stringify({ ok: false, error: String(error?.message || error || 'Unknown error') }) });

async function all(collectionId) {
  let result = await wixData.query(collectionId).limit(1000).find();
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
      all(COLLECTIONS.recipes),
      all(COLLECTIONS.sections),
      all(COLLECTIONS.components),
      all(COLLECTIONS.ingredients),
      all(COLLECTIONS.preparations)
    ]);
    return jsonOk({ recipes, sections, components, ingredients, preparations });
  } catch (error) {
    return jsonError(error);
  }
}

export async function post_dmUploadUrl(request) {
  try {
    const body = await request.body.json();
    const { requestId, fileName, mimeType, sizeInBytes, entityType, entityId } = body || {};
    if (!requestId || !fileName || !mimeType || !entityType || !entityId) return jsonBad('Incomplete upload request.');
    if (!IMAGE_TARGETS[entityType]) return jsonBad(`Unsupported image target: ${entityType}`);
    const result = await elevatedGenerateFileUploadUrl(mimeType, {
      fileName,
      sizeInBytes: Number(sizeInBytes || 0),
      private: false,
      labels: ['nexo-dynamic-recipe', entityType]
    });
    return jsonOk({ requestId, uploadUrl: result.uploadUrl, entityType, entityId });
  } catch (error) {
    return jsonError(error);
  }
}

export async function post_dmSaveImage(request) {
  try {
    const body = await request.body.json();
    const { requestId, entityType, entityId, image } = body || {};
    const target = IMAGE_TARGETS[entityType];
    if (!target) return jsonBad(`Unsupported image target: ${entityType}`);
    if (!entityId || !image?.id || !image?.url) return jsonBad('Incomplete image data.');
    const item = await wixData.get(target.collection, entityId);
    if (!item?._id) return jsonBad('Entity not found.');
    item[target.field] = {
      id: image.id,
      url: image.url,
      height: Number(image.height || 0),
      width: Number(image.width || 0),
      altText: image.altText || ''
    };
    item.imageUpdatedAt = new Date();
    const saved = await wixData.update(target.collection, item);
    return jsonOk({ requestId, entityType, entityId, image: saved[target.field] });
  } catch (error) {
    return jsonError(error);
  }
}
