import { PermissionResolvable, PermissionsBitField } from 'discord.js';

import permissionsJson from '../../json/permissions.json';

/**
 * Resolve an array of permissions 
 * 
 * @function
 * 
 * @param {Array<PermissionResolvable>} permissions - The permissions array to be resolved
 *   
 * @returns {String} permissions - A string containing the required permissions
 */
export const resolvePermissions = (permissions: PermissionResolvable[]): { permissions: string } => {
  const mappedPermissions: string = new PermissionsBitField(permissions)
    .toArray()
    .map((permission: PermissionResolvable): string => `${permissionsJson[String(permission)]}`)
    .join(', ');

  return { 
    permissions: mappedPermissions 
  }
}