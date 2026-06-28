import { registerRemotes, loadRemote } from "@module-federation/runtime";

const registeredRemotes = new Set();

/**
 * Dynamically loads a remote module.
 *
 * @param {string} remoteName
 * @param {string} remoteUrl - URL of mf-manifest.json
 * @param {string} exposedModule - Example: "./App"
 */
export async function loadRemoteComponent(
  remoteName,
  remoteUrl,
  exposedModule
) {
  // --- PREVIOUS CODE (Commented out per request) ---
  /*
  // Register only once
  if (!registeredRemotes.has(remoteName)) {
    registerRemotes([
      {
        name: remoteName,
        entry: remoteUrl,
      },
    ]);

    registeredRemotes.add(remoteName);
  }

  // Remove leading "./"
  const moduleName = exposedModule.startsWith("./")
    ? exposedModule.substring(2)
    : exposedModule;

  return await loadRemote(`${remoteName}/${moduleName}`);
  */

  // --- NEW CODE (Approach 1: Telemetry Patch) ---
  if (!registeredRemotes.has(remoteName)) {
    registerRemotes([
      {
        name: remoteName,
        entry: remoteUrl,
      },
    ]);

    // Patch the Host's telemetry data
    try {
      // Find the host instance
      const hostInstance = window.__FEDERATION__.__INSTANCES__.find(i => i.name === 'host');
      
      if (hostInstance && hostInstance.shareScopeMap.default) {
        const shareScope = hostInstance.shareScopeMap.default;
        
        // Define the standard singletons we know Vite misses telemetry for
        const expectedShares = ['react', 'react-dom', 'react-router', 'react-router-dom'];
        
        expectedShares.forEach(dep => {
          const dependencyVersions = shareScope[dep];
          if (dependencyVersions) {
            // Iterate through resolved versions (usually just one for singletons)
            Object.values(dependencyVersions).forEach(shareData => {
              // Push the remote name into the consumers array
              if (!shareData.useIn.includes(remoteName)) {
                shareData.useIn.push(remoteName);
              }
              // Manually flip the loaded flag so DevTools stops reporting 'undefined'
              if (shareData.loaded === undefined) {
                shareData.loaded = 1;
              }
            });
          }
        });
      }
    } catch (e) {
      console.warn("Non-fatal: Could not patch MF DevTools telemetry", e);
    }

    registeredRemotes.add(remoteName);
  }

  // Remove leading "./"
  const moduleName = exposedModule.startsWith("./")
    ? exposedModule.substring(2)
    : exposedModule;

  return await loadRemote(`${remoteName}/${moduleName}`);
}

