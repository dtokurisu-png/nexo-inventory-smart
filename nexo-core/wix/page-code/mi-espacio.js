import wixLocationFrontend from "wix-location-frontend";
import { currentMember } from "wix-members-frontend";
import {
  getMySpace,
  openWorkspace,
  returnToPersonal,
  respondToInvitation
} from "backend/nexo-core.web";

const HTML_ID = "#nexoMiEspacioHtml";
const CENTRAL_ACCESS = "/?nexoAuth=login&nexoReturn=mi-espacio";

function post(type, payload = {}) {
  $w(HTML_ID).postMessage({
    source: "nexo-wix-bridge",
    type,
    payload
  });
}

function goCentralAccess() {
  wixLocationFrontend.to(CENTRAL_ACCESS);
}

async function hasSignedInMember() {
  try {
    const member = await currentMember.getMember({ fieldsets: ["FULL"] });
    return Boolean(member?._id || member?.id);
  } catch (_) {
    return false;
  }
}

async function loadPersonal() {
  try {
    const state = await getMySpace();
    post("NEXO_PERSONAL_STATE", state);
  } catch (error) {
    post("NEXO_MY_SPACE_ERROR", {
      message: error?.message || "No se pudo cargar Mi espacio."
    });
  }
}

$w.onReady(function () {
  $w(HTML_ID).onMessage(async (event) => {
    const message = event.data;
    if (!message || message.source !== "nexo-mi-espacio") return;

    try {
      if (
        message.type === "NEXO_MY_SPACE_READY" ||
        message.type === "NEXO_MY_SPACE_REQUEST"
      ) {
        if (!(await hasSignedInMember())) {
          goCentralAccess();
          return;
        }

        await loadPersonal();
        return;
      }

      if (message.type === "NEXO_OPEN_WORKSPACE") {
        const state = await openWorkspace(message.payload?.workspaceId);
        post("NEXO_WORKSPACE_STATE", state);
        return;
      }

      if (message.type === "NEXO_GO_PERSONAL") {
        const state = await returnToPersonal();
        post("NEXO_PERSONAL_STATE", state);
        return;
      }

      if (message.type === "NEXO_INVITATION_ACTION") {
        const state = await respondToInvitation(
          message.payload?.invitationId,
          message.payload?.decision
        );
        post("NEXO_PERSONAL_STATE", state);
        return;
      }

      if (message.type === "NEXO_OPEN_TOOL") {
        post("NEXO_MY_SPACE_ERROR", {
          message:
            "La navegación de esta herramienta se conectará a su ruta Wix en la siguiente integración."
        });
      }
    } catch (error) {
      post("NEXO_MY_SPACE_ERROR", {
        message: error?.message || "No se pudo completar la acción."
      });
    }
  });
});
