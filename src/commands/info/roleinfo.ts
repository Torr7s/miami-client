import { 
  ApplicationCommandOptionType, 
  codeBlock, 
  InteractionReplyOptions, 
  Role
} from 'discord.js';

import CommandBase from '@/src/structures/command';
import CommandContext, { ResolvedRole } from '@/src/structures/commandContext';
import MiamiClient from '@/src/structures/client';

import EmbedComponent from '@/src/shared/components/embed';

import { formatTimestamp } from '@/src/shared/utils/functions';
import { resolvePermissions } from '@/src/shared/utils/discord/resolvables/permissions';

export default class RoleInfoCommand extends CommandBase {
  constructor(client: MiamiClient) {
    super(client, {
      name: 'cargo',
      description: 'Ver informações de um cargo',
      category: 'Info',
      options: [
        {
          name: 'cargo',
          nameLocalizations: {
            'en-US': 'role'
          },
          description: 'Cargo desejado',
          descriptionLocalizations: {
            'en-US': 'Desired role'
          },
          type: ApplicationCommandOptionType.Role,
          required: true
        }
      ]
    });
  }

  public async run(ctx: CommandContext): Promise<InteractionReplyOptions|void> {
    const resolvedRole: ResolvedRole = ctx.resolvedRoles?.[0];

    const embed: EmbedComponent = new this.client.embed(ctx.executor)
      .setTitle(`Informações do cargo ${resolvedRole.name} (${resolvedRole.id})`)
      .addField(':medal: Posição', codeBlock(`${resolvedRole.position}º lugar`))
      .addField('@ Mencionável', resolvedRole.mentionable ? 'Sim' : 'Não')
      .addField(':knot: Gerenciada', resolvedRole.managed ? 'Sim' : 'Não')
      .addField(':shield: Hosteada', resolvedRole.hoist ? 'Sim' : 'Não');

    const role = resolvedRole as Role;

    role.hexColor && embed.addField(':paintbrush: Cor', role.hexColor.toUpperCase());
    role.members.size && embed.addField(':busts_in_silhouette: Membros', `${role.members?.size}`);
    role.createdAt && embed.addField(':date: Data de Criação', `${formatTimestamp(role.createdAt)} (${formatTimestamp(role.createdTimestamp, 'R')})`, false);

    const { permissions: rolePermissions } = resolvePermissions(role.permissions?.toArray());

    rolePermissions.length && embed.addField(':dart: Permissões', codeBlock(rolePermissions), false);

    await ctx.reply({ embeds: [embed.build()] });
  }
}