import { authentication } from "wix-members-frontend";
import {
  getMySpace,
  openWorkspace,
  returnToPersonal,
  respondToInvitation
} from "backend/nexo-core.web";

const HTML_ID = "#nexoMiEspacioHtml";

function post(type, payload = {}) {
  $w(HTML_ID).postMessage({
    source: "nexo-wix-bridge",
    type,
    payload
  });
}

async function loadPersonal() {
  try {
    const state = await getMySpace();
    post("NEXO_PERSONAL_STATE", state);
  } catch (error) {
    post("NEXO_MY_SPACE_ERROR", { message: error?.message || "No se pudo cargar Mi espacio." });
  }
}

$w.onReady(function () {
  $w(HTML_ID).onMessage(async (event) => {
    const message = event.data;
    if (!message || message.source !== "nexo-mi-espacio") return;

    try {
      if (message.type === "NEXO_MY_SPACE_READY" || message.type === "NEXO_MY_SPACE_REQUEST") {
        if (!authentication.loggedIn()) {
          authentication.promptLogin({ mode: "login", modal: true })
            .then(loadPersonal)
            .catch(() => post("NEXO_MY_SPACE_ERROR", { message: "Inicia sesión para entrar a Nexo." }));
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
          message: "La navegación de esta herramienta se conectará a su ruta Wix en la siguiente integración."
        });
      }
    } catch (error) {
      post("NEXO_MY_SPACE_ERROR", { message: error?.message || "No se pudo completar la acción." });
    }
  });
});
