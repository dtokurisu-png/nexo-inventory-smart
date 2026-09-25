'use strict';

const CONTEXT_PERSONAL = 'personal';
const CONTEXT_WORKSPACE = 'workspace';

function cleanId(value) {
  return String(value || '').trim();
}

export function personalSpaceId(memberId) {
  const id = cleanId(memberId);
  if (!id) throw new Error('memberId is required');
  return 'personal-' + id;
}

export function contextStateId(memberId) {
  const id = cleanId(memberId);
  if (!id) throw new Error('memberId is required');
  return 'context-' + id;
}

export function membershipId(workspaceId, memberId) {
  const w = cleanId(workspaceId);
  const m = cleanId(memberId);
  if (!w || !m) throw new Error('workspaceId and memberId are required');
  return 'membership-' + w + '-' + m;
}

export function buildPersonalProvisioning(member) {
  const memberId = cleanId(member?.id || member?.memberId);
  if (!memberId) throw new Error('A Wix member id is required');

  const nickname = String(member?.profile?.nickname || '').trim();
  const first = String(member?.contact?.firstName || '').trim();
  const last = String(member?.contact?.lastName || '').trim();
  const fullName = [first, last].filter(Boolean).join(' ');
  const displayName = nickname || fullName || 'Mi espacio';
  const spaceId = personalSpaceId(memberId);

  return {
    userProfile: {
      id: memberId,
      data: {
        memberId,
        displayName,
        status: member?.status || 'ACTIVE',
        onboardingStatus: 'CORE_READY',
        locale: 'es',
        personalSpaceId: spaceId,
        lastContextType: CONTEXT_PERSONAL,
        lastContextId: spaceId,
        active: true,
        schemaVersion: 1,
        createdSource: 'nexo-core'
      }
    },
    personalSpace: {
      id: spaceId,
      data: {
        ownerMemberId: memberId,
        name: displayName === 'Mi espacio' ? 'Mi espacio' : displayName + ' · Mi espacio',
        status: 'ACTIVE',
        active: true,
        schemaVersion: 1
      }
    },
    contextState: {
      id: contextStateId(memberId),
      data: {
        memberId,
        contextType: CONTEXT_PERSONAL,
        contextId: spaceId,
        workspaceId: '',
        schemaVersion: 1
      }
    }
  };
}

export function buildContext(memberId, contextType, contextId, workspaceId = '') {
  const m = cleanId(memberId);
  const type = cleanId(contextType);
  const id = cleanId(contextId);
  if (!m || !id) throw new Error('memberId and contextId are required');
  if (![CONTEXT_PERSONAL, CONTEXT_WORKSPACE].includes(type)) {
    throw new Error('Invalid context type');
  }
  if (type === CONTEXT_WORKSPACE && !cleanId(workspaceId)) {
    throw new Error('workspaceId is required for workspace context');
  }
  return {
    id: contextStateId(m),
    data: {
      memberId: m,
      contextType: type,
      contextId: id,
      workspaceId: type === CONTEXT_WORKSPACE ? cleanId(workspaceId) : '',
      schemaVersion: 1
    }
  };
}

export function effectivePermissions(rolePermissions = [], overrides = []) {
  return [...new Set([...(rolePermissions || []), ...(overrides || [])])];
}

export function can(permission, rolePermissions = [], overrides = []) {
  return effectivePermissions(rolePermissions, overrides).includes(permission);
}

export const NEXO_CONTEXT = Object.freeze({
  PERSONAL: CONTEXT_PERSONAL,
  WORKSPACE: CONTEXT_WORKSPACE
});
