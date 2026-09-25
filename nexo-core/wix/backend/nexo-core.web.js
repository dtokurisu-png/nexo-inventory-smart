import wixData from "wix-data";
import { currentMember } from "wix-members-backend";
import { Permissions, webMethod } from "wix-web-module";

const OPTIONS = { suppressAuth: true, suppressHooks: true };

function clean(value) {
  return String(value || "").trim();
}

function personalSpaceId(memberId) {
  return "personal-" + clean(memberId);
}

function contextId(memberId) {
  return "context-" + clean(memberId);
}

function membershipId(workspaceId, memberId) {
  return "membership-" + clean(workspaceId) + "-" + clean(memberId);
}

function displayName(member) {
  const nickname = clean(member?.profile?.nickname);
  const first = clean(member?.contactDetails?.firstName || member?.contact?.firstName);
  const last = clean(member?.contactDetails?.lastName || member?.contact?.lastName);
  return nickname || [first, last].filter(Boolean).join(" ") || "Usuario Nexo";
}

async function getItem(collectionId, id) {
  try {
    return await wixData.get(collectionId, id, OPTIONS);
  } catch (_) {
    return null;
  }
}

async function ensureCore(member) {
  const memberId = clean(member?._id || member?.id);
  if (!memberId) throw new Error("No se pudo identificar al miembro.");
  const name = displayName(member);
  const spaceId = personalSpaceId(memberId);

  let profile = await getItem("NexoUserProfiles", memberId);
  if (!profile) {
    profile = await wixData.save("NexoUserProfiles", {
      _id: memberId,
      memberId,
      displayName: name,
      status: member?.status || "ACTIVE",
      onboardingStatus: "CORE_READY",
      locale: "es",
      personalSpaceId: spaceId,
      lastContextType: "personal",
      lastContextId: spaceId,
      active: true,
      schemaVersion: 1,
      createdSource: "mi-espacio-lazy-provision"
    }, OPTIONS);
  } else if (profile.displayName !== name) {
    profile = await wixData.save("NexoUserProfiles", { ...profile, displayName: name }, OPTIONS);
  }

  let personalSpace = await getItem("NexoPersonalSpaces", spaceId);
  if (!personalSpace) {
    personalSpace = await wixData.save("NexoPersonalSpaces", {
      _id: spaceId,
      ownerMemberId: memberId,
      name: name + " · Mi espacio",
      status: "ACTIVE",
      active: true,
      schemaVersion: 1
    }, OPTIONS);
  }

  let context = await getItem("NexoContextState", contextId(memberId));
  if (!context) {
    context = await wixData.save("NexoContextState", {
      _id: contextId(memberId),
      memberId,
      contextType: "personal",
      contextId: spaceId,
      workspaceId: "",
      switchedAt: new Date(),
      schemaVersion: 1
    }, OPTIONS);
  }

  return { memberId, profile, personalSpace, context };
}

async function current() {
  return currentMember.getMember({ fieldsets: ["FULL"] });
}

async function roleFor(roleKey) {
  return getItem("NexoCoreRoles", clean(roleKey));
}

async function personalTools() {
  const result = await wixData.query("NexoToolCatalog")
    .eq("active", true)
    .ascending("sortOrder")
    .limit(100)
    .find(OPTIONS);
  return result.items.filter(x => x.personalDefault === true && Array.isArray(x.scopeModes) && x.scopeModes.includes("personal"));
}

async function workspaceTools() {
  const result = await wixData.query("NexoToolCatalog")
    .eq("active", true)
    .ascending("sortOrder")
    .limit(100)
    .find(OPTIONS);
  return result.items.filter(x => Array.isArray(x.scopeModes) && x.scopeModes.includes("workspace"));
}

async function myMemberships(memberId) {
  const result = await wixData.query("NexoWorkspaceMembers")
    .eq("memberId", memberId)
    .eq("active", true)
    .eq("status", "active")
    .limit(100)
    .find(OPTIONS);
  return result.items;
}

async function pendingInvitations(member) {
  const memberId = clean(member?._id || member?.id);
  const email = clean(member?.loginEmail).toLowerCase();
  const byId = await wixData.query("NexoInvitations")
    .eq("inviteeMemberId", memberId)
    .eq("status", "pending")
    .eq("active", true)
    .limit(100)
    .find(OPTIONS);
  let items = [...byId.items];
  if (email) {
    const byEmail = await wixData.query("NexoInvitations")
      .eq("inviteeEmail", email)
      .eq("status", "pending")
      .eq("active", true)
      .limit(100)
      .find(OPTIONS);
    const seen = new Set(items.map(x => x._id));
    for (const item of byEmail.items) if (!seen.has(item._id)) items.push(item);
  }
  return items;
}

async function buildPersonalState(member) {
  const core = await ensureCore(member);
  const memberships = await myMemberships(core.memberId);
  const workspaces = [];
  for (const membership of memberships) {
    const workspace = await getItem("NexoWorkspaces", membership.workspaceId);
    if (!workspace || workspace.active !== true) continue;
    workspaces.push({
      workspaceId: workspace._id,
      name: workspace.name,
      description: workspace.description || "",
      roleKey: membership.roleKey,
      role: await roleFor(membership.roleKey)
    });
  }

  const invitationRows = await pendingInvitations(member);
  const invitations = [];
  for (const invitation of invitationRows) {
    const workspace = await getItem("NexoWorkspaces", invitation.workspaceId);
    invitations.push({
      id: invitation._id,
      workspaceId: invitation.workspaceId,
      workspaceName: workspace?.name || "Espacio de trabajo",
      roleKey: invitation.roleKey,
      role: await roleFor(invitation.roleKey),
      expiresAt: invitation.expiresAt || null
    });
  }

  return {
    mode: "personal",
    profile: {
      displayName: core.profile.displayName,
      locale: core.profile.locale || "es"
    },
    personalSpace: {
      id: core.personalSpace._id,
      name: core.personalSpace.name
    },
    currentContext: core.context,
    tools: await personalTools(),
    workspaces,
    invitations
  };
}

async function persistContext(memberId, type, targetId, workspaceId = "") {
  const id = contextId(memberId);
  const existing = await getItem("NexoContextState", id);
  const context = await wixData.save("NexoContextState", {
    ...(existing || {}),
    _id: id,
    memberId,
    contextType: type,
    contextId: targetId,
    workspaceId,
    switchedAt: new Date(),
    schemaVersion: 1
  }, OPTIONS);

  const profile = await getItem("NexoUserProfiles", memberId);
  if (profile) {
    await wixData.save("NexoUserProfiles", {
      ...profile,
      lastContextType: type,
      lastContextId: targetId
    }, OPTIONS);
  }
  return context;
}

async function buildWorkspaceState(member, workspaceId, shouldPersist = true) {
  const core = await ensureCore(member);
  const membershipResult = await wixData.query("NexoWorkspaceMembers")
    .eq("workspaceId", workspaceId)
    .eq("memberId", core.memberId)
    .eq("active", true)
    .eq("status", "active")
    .limit(1)
    .find(OPTIONS);
  const membership = membershipResult.items[0];
  if (!membership) throw new Error("No tienes acceso a este espacio de trabajo.");

  const workspace = await getItem("NexoWorkspaces", workspaceId);
  if (!workspace || workspace.active !== true) throw new Error("Este espacio de trabajo no está disponible.");

  if (shouldPersist) await persistContext(core.memberId, "workspace", workspaceId, workspaceId);

  return {
    mode: "workspace",
    workspace: {
      id: workspace._id,
      name: workspace.name,
      description: workspace.description || ""
    },
    membership: {
      roleKey: membership.roleKey,
      permissions: membership.permissions || []
    },
    role: await roleFor(membership.roleKey),
    tools: await workspaceTools()
  };
}

export const getMySpace = webMethod(Permissions.SiteMember, async () => {
  const member = await current();
  return buildPersonalState(member);
});

export const openWorkspace = webMethod(Permissions.SiteMember, async (workspaceId) => {
  const member = await current();
  return buildWorkspaceState(member, clean(workspaceId), true);
});

export const returnToPersonal = webMethod(Permissions.SiteMember, async () => {
  const member = await current();
  const core = await ensureCore(member);
  await persistContext(core.memberId, "personal", personalSpaceId(core.memberId), "");
  return buildPersonalState(member);
});

export const respondToInvitation = webMethod(Permissions.SiteMember, async (invitationId, decision) => {
  const member = await current();
  const core = await ensureCore(member);
  const invitation = await getItem("NexoInvitations", clean(invitationId));
  if (!invitation || invitation.status !== "pending" || invitation.active !== true) {
    throw new Error("La invitación ya no está disponible.");
  }

  const email = clean(member?.loginEmail).toLowerCase();
  const belongsToMember =
    clean(invitation.inviteeMemberId) === core.memberId ||
    (email && clean(invitation.inviteeEmail).toLowerCase() === email);
  if (!belongsToMember) throw new Error("Esta invitación no pertenece a tu cuenta.");

  if (invitation.expiresAt && new Date(invitation.expiresAt).getTime() < Date.now()) {
    await wixData.save("NexoInvitations", { ...invitation, status: "expired", active: false }, OPTIONS);
    throw new Error("Esta invitación expiró.");
  }

  const normalized = clean(decision).toLowerCase();
  if (!["accept", "decline"].includes(normalized)) throw new Error("Acción de invitación no válida.");

  if (normalized === "accept") {
    const id = membershipId(invitation.workspaceId, core.memberId);
    const existing = await getItem("NexoWorkspaceMembers", id);
    await wixData.save("NexoWorkspaceMembers", {
      ...(existing || {}),
      _id: id,
      workspaceId: invitation.workspaceId,
      memberId: core.memberId,
      roleKey: invitation.roleKey || "collaborator",
      status: "active",
      permissions: existing?.permissions || [],
      invitedByMemberId: invitation.invitedByMemberId || "",
      joinedAt: existing?.joinedAt || new Date(),
      active: true,
      schemaVersion: 1
    }, OPTIONS);
  }

  await wixData.save("NexoInvitations", {
    ...invitation,
    inviteeMemberId: core.memberId,
    status: normalized === "accept" ? "accepted" : "declined",
    acceptedAt: normalized === "accept" ? new Date() : invitation.acceptedAt,
    active: false
  }, OPTIONS);

  return buildPersonalState(member);
});
