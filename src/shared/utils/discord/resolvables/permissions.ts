import { PermissionResolvable, PermissionsBitField } from 'discord.js';

import permissionsJson from '../../json/permissions.json';

export const resolvePermissions = (permissions: PermissionResolvable[]): string => {
  const mappedMissingPermissions: string = new PermissionsBitField(permissions)
    .toArray()
    .map((permission: PermissionResolvable): string => `${permissionsJson[String(permission)]}`)
    .join(', ');

  return mappedMissingPermissions;
}