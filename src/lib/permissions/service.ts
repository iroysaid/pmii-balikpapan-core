import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import { defaultPermissionConfig } from "./defaults";
import type { PermissionConfig } from "./types";

const PERMISSION_CONFIG_PATH = path.join(
  process.cwd(),
  "data",
  "role-permissions.json"
);

function mergePermissionConfig(config?: Partial<PermissionConfig>): PermissionConfig {
  return {
    sessionMaxAgeSeconds:
      config?.sessionMaxAgeSeconds || defaultPermissionConfig.sessionMaxAgeSeconds,
    roles: {
      SUPER_ADMIN: {
        ...defaultPermissionConfig.roles.SUPER_ADMIN,
        ...config?.roles?.SUPER_ADMIN,
      },
      ADMIN: {
        ...defaultPermissionConfig.roles.ADMIN,
        ...config?.roles?.ADMIN,
      },
      EDITOR: {
        ...defaultPermissionConfig.roles.EDITOR,
        ...config?.roles?.EDITOR,
      },
      CONTRIBUTOR: {
        ...defaultPermissionConfig.roles.CONTRIBUTOR,
        ...config?.roles?.CONTRIBUTOR,
      },
    },
  };
}

export async function getPermissionConfig(): Promise<PermissionConfig> {
  try {
    const raw = await fs.readFile(PERMISSION_CONFIG_PATH, "utf8");
    return mergePermissionConfig(JSON.parse(raw) as Partial<PermissionConfig>);
  } catch {
    return defaultPermissionConfig;
  }
}

export async function savePermissionConfig(config: PermissionConfig) {
  const merged = mergePermissionConfig(config);
  await fs.mkdir(path.dirname(PERMISSION_CONFIG_PATH), { recursive: true });
  await fs.writeFile(
    PERMISSION_CONFIG_PATH,
    `${JSON.stringify(merged, null, 2)}\n`,
    "utf8"
  );
}

export function getPermissionConfigFilePath() {
  return PERMISSION_CONFIG_PATH;
}
