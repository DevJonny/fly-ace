const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata';

let tokenClient;
let accessToken = null;
export let isAuthenticated = false;
let authChangeListener = null;

export function initDriveAuth(onChange) {
  authChangeListener = onChange;
  
  if (!CLIENT_ID) {
    console.warn("No VITE_GOOGLE_CLIENT_ID found. Drive sync disabled.");
    return;
  }

  // Ensure google client is loaded
  const checkGoogle = setInterval(() => {
    if (window.google && window.google.accounts) {
      clearInterval(checkGoogle);
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          if (tokenResponse.error !== undefined) {
            console.error(tokenResponse);
            return;
          }
          accessToken = tokenResponse.access_token;
          isAuthenticated = true;
          if (authChangeListener) authChangeListener(true);
        },
      });
    }
  }, 100);
}

export function login() {
  if (tokenClient) {
    tokenClient.requestAccessToken({prompt: ''}); // prompt: consent will force re-auth
  }
}

export function logout() {
  if (accessToken && window.google) {
    window.google.accounts.oauth2.revoke(accessToken, () => {
      accessToken = null;
      isAuthenticated = false;
      if (authChangeListener) authChangeListener(false);
    });
  }
}

const FILE_NAME = 'fly-marks-data.json';

async function getFileId() {
  if (!accessToken) return null;
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${FILE_NAME}'`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const data = await res.json();
  if (data.files && data.files.length > 0) {
    return data.files[0].id;
  }
  return null;
}

export async function saveToDrive(dataObj) {
  if (!isAuthenticated || !accessToken) return false;
  
  const fileId = await getFileId();
  const fileContent = JSON.stringify(dataObj);
  const metadata = {
    name: FILE_NAME,
    parents: ['appDataFolder']
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([fileContent], { type: 'application/json' }));

  let url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
  let method = 'POST';

  if (fileId) {
    url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`;
    method = 'PATCH';
  }

  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${accessToken}` },
    body: form
  });

  return res.ok;
}

export async function loadFromDrive() {
  if (!isAuthenticated || !accessToken) return null;
  
  const fileId = await getFileId();
  if (!fileId) return null;

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  if (res.ok) {
    return await res.json();
  }
  return null;
}
