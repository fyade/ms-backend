import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { AlgorithmDto } from './dto';
import { InterfaceService } from '../interface/interface.service';
import { InterfaceGroupService } from '../interface-group/interface-group.service';
import { getCurrentUser } from '../../../../util/baseContext';
import { AuthService } from '../../../auth/auth.service';
import { requestSF } from '../../../../api/request';
import { base } from '../../../../util/base';

@Injectable()
export class AlgorithmService {
  constructor(
    private readonly authService: AuthService,
    private readonly interfaceService: InterfaceService,
    private readonly interfaceGroupService: InterfaceGroupService,
  ) {
  }

  async algorithm(dto: AlgorithmDto): Promise<R> {
    const userId = getCurrentUser().user.userid;
    const permission = dto.perms;
    const sfPermissionsOfUserid = await this.authService.getSFPermissionsOfUserid(userId, permission, base.Y);
    if (sfPermissionsOfUserid.length > 0) {
      const permissionId = sfPermissionsOfUserid.every(item => item.ifUseUp === base.Y)
        ? sfPermissionsOfUserid[sfPermissionsOfUserid.length - 1].permissionId
        : sfPermissionsOfUserid[sfPermissionsOfUserid.findIndex(item => item.ifUseUp === base.N)].permissionId;
      const interfaceGroup = await this.interfaceGroupService.selOneInterfaceGroup(permissionId);
      const inter = await this.interfaceService.selAllInterface({ perms: dto.perms });
      if (interfaceGroup.data && inter.data.length > 0) {
        const response = await requestSF({
          baseURL: interfaceGroup.data.baseURL,
          url: inter.data[0].url,
          data: dto.data,
        });
        return R.ok(response);
      }
    }
    return R.err('');
  }
}
