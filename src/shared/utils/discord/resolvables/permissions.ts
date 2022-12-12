import { PermissionResolvable, PermissionsBitField } from 'discord.js';

import permissionsJson from '../../json/permissions.json';

export const resolvePermissions = (permissions: PermissionResolvable[]): { permissions: string } => {
  const mappedPermissions: string = new PermissionsBitField(permissions)
    .toArray()
    .map((permission: PermissionResolvable): string => `${permissionsJson[String(permission)]}`)
    .join(', ');

  return { 
    permissions: mappedPermissions 
  }
}