/**
 * 代码生成说明：
 *
 * 后端部分：
 * * 在 src/module/模块/业务/ 目录内新增 .controller.ts
 * * 在 src/module/模块/业务/ 目录内新增 .service.ts
 * * 在 src/module/模块/业务/ 目录内新增 dto.ts
 * * 在 src/module/模块/业务/ 目录内新增 .module.ts，并在 @module().controllers 中引入 controller，在 @module().providers 中引入 service、AuthService、JwtService
 * * 在 app.module.ts 中，导入 module 文件，并在 @module().imports 中添加
 *
 * 前端部分：
 * * 接口：在 src/api/module/模块/ 目录内新增 业务.ts 文件
 * * 类型：在 src/type/api/模块/ 目录内新增 业务.ts 文件
 * * 页面：在 src/views/模块/业务/ 目录内新增 index.vue 文件
 */
import { codeGenTableDto } from '../code-gen-table/dto';
import { codeGenColumnDto } from '../code-gen-column/dto';
import { capitalizeFirstLetter, lowercaseFirstLetter, toCamelCase, toKebabCase } from '../../../util/BaseUtils';
import { base, publicDict } from '../../../util/base';
import { Type } from 'class-transformer';

const baseInterfaceColumns = [
  'createBy',
  'updateBy',
  'createTime',
  'updateTime',
  'deleted'
]

/**
 * 代码生成
 * @param table
 * @param columns
 */
export function codeGeneration({ table, columns }: { table: codeGenTableDto, columns: codeGenColumnDto[] }) {
  const businessName = lowercaseFirstLetter(table.businessName);
  const moduleName = lowercaseFirstLetter(table.moduleName);
  const getDefaultValue = (tsName: string, tsType: string) => {
  };
  const qd3_dialogFormDefaultData = [
    [
      (key?: any) => key === 'ifDefault',
      (key?: any) => 'final.IS_DEFAULT_YES'
    ],
    [
      (key?: any) => key === 'ifDisabled',
      (key?: any) => 'final.DISABLED_NO'
    ],
    [
      (key?: any) => key === 'parentId',
      (key?: any) => 'final.DEFAULT_PARENT_ID'
    ],
    [
      (key?: any) => key === 'orderNum',
      (key?: any) => 'final.DEFAULT_ORDER_NUM'
    ],
    [
      (key?: any) => true,
      (key?: any) => `''`
    ]
  ]
  const qd3_dialogFormForm = [
    [
      (formType: any, index: number, length: number) => formType === 'inputNumber',
      (tsName: any, index: number, length: number) => {
        const string = `            <el-form-item :label="state.dict['${tsName}']" prop="${tsName}">
              <el-input-number v-model="state.dialogForm['${tsName}']" controls-position="right"/>
            </el-form-item>`;
        const ifLastAndSingular = index === length - 1 && length % 2 === 1
        return `${index % 2 === 0 ? `        <el-row>
          <el-col :span="${ifLastAndSingular ? 24 : 12}">` : `          <el-col :span="12">`}
${string}
${index % 2 === 1 || ifLastAndSingular ? `          </el-col>
        </el-row>` : `          </el-col>`}`;
      },
      (tsName: any, index: number, length: number) => {
        return `
          <el-table-column prop="${tsName}" :label="state.dict['${tsName}']" width="300">
            <template #header>
              <span :class="ifRequired('${tsName}')?'tp-table-header-required':''">{{ state.dict['${tsName}'] }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[\`\${$index}-${tsName}\`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <el-input-number v-model="state.dialogForms[$index]['${tsName}']" controls-position="right"/>
              </div>
            </template>
          </el-table-column>`;
      }
    ],
    [
      (formType: any, index: number, length: number) => formType === 'textarea',
      (tsName: any, index: number, length: number) => {
        const string = `            <el-form-item :label="state.dict['${tsName}']" prop="${tsName}">
              <el-input type="textarea" v-model="state.dialogForm['${tsName}']" :placeholder="state.dict['${tsName}']"/>
            </el-form-item>`;
        const ifLastAndSingular = index === length - 1 && length % 2 === 1
        return `${index % 2 === 0 ? `        <el-row>
          <el-col :span="${ifLastAndSingular ? 24 : 12}">` : `          <el-col :span="12">`}
${string}
${index % 2 === 1 || ifLastAndSingular ? `          </el-col>
        </el-row>` : `          </el-col>`}`;
      },
      (tsName: any, index: number, length: number) => {
        return `
          <el-table-column prop="${tsName}" :label="state.dict['${tsName}']" width="300">
            <template #header>
              <span :class="ifRequired('${tsName}')?'tp-table-header-required':''">{{ state.dict['${tsName}'] }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[\`\${$index}-${tsName}\`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <el-input type="textarea" v-model="state.dialogForms[$index]['${tsName}']" :placeholder="state.dict['${tsName}']"/>
              </div>
            </template>
          </el-table-column>`;
      }
    ],
    [
      (formType: any, index: number, length: number) => formType === 'radio',
      (tsName: any, index: number, length: number) => {
        const string = `            <el-form-item :label="state.dict['${tsName}']" prop="${tsName}">
              <el-radio-group v-model="state.dialogForm['${tsName}']">
                <el-radio :label="final.Y">是</el-radio>
                <el-radio :label="final.N">否</el-radio>
              </el-radio-group>
            </el-form-item>`;
        const ifLastAndSingular = index === length - 1 && length % 2 === 1
        return `${index % 2 === 0 ? `        <el-row>
          <el-col :span="${ifLastAndSingular ? 24 : 12}">` : `          <el-col :span="12">`}
${string}
${index % 2 === 1 || ifLastAndSingular ? `          </el-col>
        </el-row>` : `          </el-col>`}`;
      },
      (tsName: any, index: number, length: number) => {
        return `
          <el-table-column prop="${tsName}" :label="state.dict['${tsName}']" width="70">
            <template #header>
              <span :class="ifRequired('${tsName}')?'tp-table-header-required':''">{{ state.dict['${tsName}'] }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[\`\${$index}-${tsName}\`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <el-checkbox v-model="state.dialogForms[$index]['${tsName}']" :true-label="final.Y" :false-label="final.N"/>
              </div>
            </template>
          </el-table-column>`;
      }
    ],
    [
      (formType: any, index: number, length: number) => formType === 'input' || true,
      (tsName: any, index: number, length: number) => {
        const string = `            <el-form-item :label="state.dict['${tsName}']" prop="${tsName}">
              <el-input v-model="state.dialogForm['${tsName}']" :placeholder="state.dict['${tsName}']"/>
            </el-form-item>`;
        const ifLastAndSingular = index === length - 1 && length % 2 === 1
        return `${index % 2 === 0 ? `        <el-row>
          <el-col :span="${ifLastAndSingular ? 24 : 12}">` : `          <el-col :span="12">`}
${string}
${index % 2 === 1 || ifLastAndSingular ? `          </el-col>
        </el-row>` : `          </el-col>`}`;
      },
      (tsName: any, index: number, length: number) => {
        return `
          <el-table-column prop="${tsName}" :label="state.dict['${tsName}']" width="300">
            <template #header>
              <span :class="ifRequired('${tsName}')?'tp-table-header-required':''">{{ state.dict['${tsName}'] }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[\`\${$index}-${tsName}\`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <el-input v-model="state.dialogForms[$index]['${tsName}']" :placeholder="state.dict['${tsName}']"/>
              </div>
            </template>
          </el-table-column>`;
      }
    ]
  ]
  const hd1 =
`import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ${capitalizeFirstLetter(moduleName)}Service } from './${toKebabCase(moduleName)}.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { insOneDto, selAllDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';

@Controller('/${toKebabCase(businessName)}/${toKebabCase(moduleName)}')
@ApiTags('${table.tableDescr}')
@UsePipes(new ValidationPipe())
export class ${capitalizeFirstLetter(moduleName)}Controller {
  constructor(private readonly ${moduleName}Service: ${capitalizeFirstLetter(moduleName)}Service) {
  }

  @Get()
  @Authorize('${businessName}:${moduleName}:selList')
  async sel${capitalizeFirstLetter(moduleName)}(@Query() dto: selListDto): Promise<R> {
    return this.${moduleName}Service.sel${capitalizeFirstLetter(moduleName)}(dto);
  }

  @Get('/all')
  @Authorize('${businessName}:${moduleName}:selAll')
  async selAll(@Query() dto: selAllDto) {
    return this.${moduleName}Service.selAll(dto);
  }

  @Get('/ids')
  @Authorize('${businessName}:${moduleName}:selOnes')
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.${moduleName}Service.selOnes(ids);
  }

  @Get('/:id')
  @Authorize('${businessName}:${moduleName}:selOne')
  async selOne(@Param('id') id: number): Promise<R> {
    return this.${moduleName}Service.selOne(id);
  }

  @Post()
  @Authorize('${businessName}:${moduleName}:ins')
  async ins${capitalizeFirstLetter(moduleName)}(@Body() dto: insOneDto): Promise<R> {
    return this.${moduleName}Service.ins${capitalizeFirstLetter(moduleName)}(dto);
  }

  @Post('/s')
  @Authorize('${businessName}:${moduleName}:inss')
  async ins${capitalizeFirstLetter(moduleName)}s(@Body(
    new ParseArrayPipe({
      items: insOneDto
    })
  ) dto: insOneDto[]): Promise<R> {
    return this.${moduleName}Service.ins${capitalizeFirstLetter(moduleName)}s(dto);
  }

  @Put()
  @Authorize('${businessName}:${moduleName}:upd')
  async upd${capitalizeFirstLetter(moduleName)}(@Body() dto: updOneDto): Promise<R> {
    return this.${moduleName}Service.upd${capitalizeFirstLetter(moduleName)}(dto);
  }

  @Put('/s')
  @Authorize('${businessName}:${moduleName}:upds')
  async upd${capitalizeFirstLetter(moduleName)}s(@Body(
    new ParseArrayPipe({
      items: updOneDto
    })
  ) dto: updOneDto[]): Promise<R> {
    return this.${moduleName}Service.upd${capitalizeFirstLetter(moduleName)}s(dto);
  }

  @Delete()
  @Authorize('${businessName}:${moduleName}:del')
  async del${capitalizeFirstLetter(moduleName)}(@Body() ids: any[]): Promise<R> {
    return this.${moduleName}Service.del${capitalizeFirstLetter(moduleName)}(ids);
  }
}
`;
  const hd2 =
`import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ${moduleName}Dto, insOneDto, selAllDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';

@Injectable()
export class ${capitalizeFirstLetter(moduleName)}Service {
  constructor(private readonly prisma: PrismaService) {
  }

  async sel${capitalizeFirstLetter(moduleName)}(dto: selListDto): Promise<R> {
    const res = await this.prisma.findPage<${moduleName}Dto, selListDto>('${table.tableName}', {
      data: dto,
      orderBy: ${columns.findIndex(item => item.colName === 'order_num') > -1},
      notNullKeys: [${columns.filter(item => item.ifRequired === base.Y).map(item => `'${toCamelCase(item.colName)}'`).join(', ')}],
      numberKeys: [${columns.filter(item => item.tsType === 'number' && item.ifSelMore === base.Y).map(item => `'${toCamelCase(item.colName)}'`).join(', ')}],
    });
    return R.ok(res);
  }

  async selAll(dto: selAllDto): Promise<R> {
    const res = await this.prisma.findAll('${table.tableName}', {
      data: dto,
      orderBy: ${columns.findIndex(item => item.colName === 'order_num') > -1},
      notNullKeys: [${columns.filter(item => item.ifRequired === base.Y).map(item => `'${toCamelCase(item.colName)}'`).join(', ')}],
      numberKeys: [${columns.filter(item => item.tsType === 'number' && item.ifSelMore === base.Y).map(item => `'${toCamelCase(item.colName)}'`).join(', ')}],
    });
    return R.ok(res);
  }

  async selOnes(ids: any[]): Promise<R> {
    const res = await this.prisma.findByIds('${table.tableName}', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOne(id: number): Promise<R> {
    const res = await this.prisma.findById('${table.tableName}', Number(id));
    return R.ok(res);
  }

  async ins${capitalizeFirstLetter(moduleName)}(dto: insOneDto): Promise<R> {
    const res = await this.prisma.create('${table.tableName}', dto);
    return R.ok(res);
  }

  async ins${capitalizeFirstLetter(moduleName)}s(dtos: insOneDto[]): Promise<R> {
    const res = await this.prisma.createMany('${table.tableName}', dtos);
    return R.ok(res);
  }

  async upd${capitalizeFirstLetter(moduleName)}(dto: updOneDto): Promise<R> {
    const res = await this.prisma.updateById('${table.tableName}', dto);
    return R.ok(res);
  }

  async upd${capitalizeFirstLetter(moduleName)}s(dtos: updOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany('${table.tableName}', dtos);
    return R.ok(res);
  }

  async del${capitalizeFirstLetter(moduleName)}(ids: any[]): Promise<R> {
    const res = await this.prisma.deleteById('${table.tableName}', ids);
    return R.ok(res);
  }
}
`;
  const hd3 =
`import { pageSelDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';
import { IsNotEmpty } from 'class-validator';

export class ${moduleName}Dto extends baseInterface {
${
  columns
    .filter(item => baseInterfaceColumns.indexOf(item.tsName) === -1)
    .map(column => `  ${column.tsName}: ${column.tsType};`)
    .join('\n\n')
}
}

export class selListDto extends pageSelDto {
  id: ${columns.find(item => item.colName === 'id').tsType};

${
  columns
    .filter(item => item.ifSelMore === base.Y)
    .map(column => `  ${column.tsName}: ${column.tsType};`)
    .join('\n\n')
}
}

export class insOneDto {
${
    columns
      .filter(item => item.ifIns === base.Y)
      .map(column => `${column.tsType === 'number' ? `  @Type(() => Number)\n` : ''}${column.ifRequired === base.Y ? `  @IsNotEmpty({ message: '${column.colDescr}不能为空' })\n` : ''}  ${column.tsName}: ${column.tsType};`)
      .join('\n\n')
  }
}

export class selAllDto {
${
  columns
    .filter(item => item.ifSelMore === base.Y)
    .map(column => `  ${column.tsName}: ${column.tsType};`)
    .join('\n\n')
}
}

export class updOneDto extends insOneDto {
  @IsNotEmpty({ message: '主键id不能为空' })
  id: ${columns.find(item => item.colName === 'id').tsType};
}
`;
  const hd4 =
`import { Module } from '@nestjs/common';
import { ${capitalizeFirstLetter(moduleName)}Controller } from './${toKebabCase(moduleName)}.controller';
import { ${capitalizeFirstLetter(moduleName)}Service } from './${toKebabCase(moduleName)}.service';
import { AuthService } from '../../sys-manage/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [${capitalizeFirstLetter(moduleName)}Controller],
  providers: [${capitalizeFirstLetter(moduleName)}Service, AuthService, JwtService]
})
export class ${capitalizeFirstLetter(moduleName)}Module {
}
`;
  const hd5 =
`在 app.module.ts 中，导入 module 文件，并在 @module().imports 中添加，具体语句如下：
import { ${capitalizeFirstLetter(moduleName)}Module } from './module/${toKebabCase(businessName)}/${toKebabCase(moduleName)}/${toKebabCase(moduleName)}.module';
${capitalizeFirstLetter(moduleName)}Module
`;
  const qd1 =
`import request from "@/api/request.ts";
import { ${moduleName}InsDto, ${moduleName}SelAllDto, ${moduleName}SelDto, ${moduleName}UpdDto } from "@/type/api/${businessName}/${moduleName}.ts";

export function ${moduleName}Sel(params: ${moduleName}SelDto) {
  return request({
    url: '/${toKebabCase(businessName)}/${toKebabCase(moduleName)}',
    method: 'GET',
    params: params
  })
}

export function ${moduleName}SelAll(params: ${moduleName}SelAllDto) {
  return request({
    url: '/${toKebabCase(businessName)}/${toKebabCase(moduleName)}/all',
    method: 'GET',
    params: params
  })
}

export function ${moduleName}SelById(id: number) {
  return request({
    url: \`/${toKebabCase(businessName)}/${toKebabCase(moduleName)}/\${id}\`,
    method: 'GET'
  })
}

export function ${moduleName}SelByIds(ids: any[]) {
  return request({
    url: \`/${toKebabCase(businessName)}/${toKebabCase(moduleName)}/ids\`,
    method: 'GET',
    params: ids
  })
}

export function ${moduleName}Ins(params: ${moduleName}InsDto) {
  return request({
    url: '/${toKebabCase(businessName)}/${toKebabCase(moduleName)}',
    method: 'POST',
    data: params
  })
}

export function ${moduleName}Upd(params: ${moduleName}UpdDto) {
  return request({
    url: '/${toKebabCase(businessName)}/${toKebabCase(moduleName)}',
    method: 'PUT',
    data: params
  })
}

export function ${moduleName}Inss(params: ${moduleName}InsDto[]) {
  return request({
    url: '/${toKebabCase(businessName)}/${toKebabCase(moduleName)}/s',
    method: 'POST',
    data: params
  })
}

export function ${moduleName}Upds(params: ${moduleName}UpdDto[]) {
  return request({
    url: '/${toKebabCase(businessName)}/${toKebabCase(moduleName)}/s',
    method: 'PUT',
    data: params
  })
}

export function ${moduleName}Del(ids: any[]) {
  return request({
    url: '/${toKebabCase(businessName)}/${toKebabCase(moduleName)}',
    method: 'DELETE',
    data: ids
  })
}
`;
  const qd2 =
`import { pageSelDto } from "@/type/tablePage.ts";

export class ${moduleName}SelDto extends pageSelDto {
}

export class ${moduleName}SelAllDto {
}

export class ${moduleName}InsDto {
${
    columns
      .filter(item => item.ifIns === base.Y)
      .map(column => `  ${column.tsName}!: ${column.tsType};`)
      .join('\n')
  }
}

export class ${moduleName}UpdDto {
  id!: ${columns.find(item => item.colName === 'id').tsType};
${
  columns
    .filter(item => item.ifIns === base.Y)
    .map(column => `  ${column.tsName}!: ${column.tsType};`)
    .join('\n')
}
}
`;
  const qd3 =
`<script lang="ts">
export default {
  name: '${businessName}:${moduleName}'
}
</script>
` + `
<script setup lang="ts">
import { reactive, ref } from "vue"
import { CONFIG, final, PAGINATION, publicDict } from "@/utils/base.ts"
import Pagination from "@/components/pagination/pagination.vue"
import { funcTablePage } from "@/composition/tablePage/tablePage.js"
import { State, t_config, t_FuncMap } from "@/type/tablePage.ts"
import type { FormRules } from 'element-plus'
import { Delete, Download, Edit, Plus, Refresh, Upload } from "@element-plus/icons-vue";
import { MORE, ONE } from "@/type/utils/base.ts"
import {
  ${moduleName}Sel,
  ${moduleName}SelById,
  ${moduleName}SelByIds,
  ${moduleName}Ins,
  ${moduleName}Upd,
  ${moduleName}Inss,
  ${moduleName}Upds,
  ${moduleName}Del,
} from "@/api/module/${businessName}/${moduleName}.ts"

const state = reactive<State>({
  dialogType: {
    value: '',
    label: ''
  },
  // 这个是弹出框表单
  // 格式: {
  //   id: '',
  //   ifDefault: final.IS_DEFAULT_YES,
  //   ifDisabled: final.DISABLED_NO,
  //   parentId: final.DEFAULT_PARENT_ID,
  //   orderNum: final.DEFAULT_ORDER_NUM,
  //   ...
  // }
  dialogForm: {
    id: '',
${
    columns
      .filter(item => item.ifIns === base.Y)
      .map(column => `    ${column.tsName}: ${qd3_dialogFormDefaultData.find(funcs => funcs[0](column.tsName))[1]()},`)
      .join('\n')
  }
  },
  dialogForms: [],
  dialogForms_error: {},
  // 这个是弹出框表单校验
  // 格式: {
  //   name: [{ required: true, trigger: 'change' }],
  //   ...
  // }
  dFormRules: {
${
    columns
      .filter(item => item.ifRequired === base.Y)
      .map(item => `    ${item.tsName}: [{required: true, trigger: 'change'}],`)
      .join('\n')
  }
  } as FormRules,
  // 字典
  // 格式: {
  //   ...publicDict,
  //   name: '名字',
  //   ...
  // }
  dict: {
    ...publicDict,
${
    columns
      .filter(item => Object.keys(publicDict).indexOf(item.tsName) === -1)
      .map(item => `    ${item.tsName}: '${item.colDescr}',`)
      .join('\n')
  }
  },
  // 筛选表单
  // 格式: {
  //   name: '',
  //   ...
  // }
  filterForm: {},
  list: [],
  multipleSelection: [],
  total: -1,
  pageParam: {
    pageNum: PAGINATION.pageNum,
    pageSize: PAGINATION.pageSize
  }
})
const state2 = reactive({
  orderNum: 0
})
const dialogFormRef = ref(null)
const dialogFormsRef = ref(null)
const filterFormRef = ref(null)
const dialogVisible = ref(false)
const dialogLoadingRef = ref(false)
const tableLoadingRef = ref(false)
const switchLoadingRef = ref(false)
const activeTabName = ref<ONE | MORE>(final.one)
const config: t_config = reactive({
  selectParam: {}, // 查询参数（补充
  getDataOnMounted: true, // 页面加载时获取数据，默认true
  pageQuery: true, // 分页，默认true
  watchDialogVisible: true, // 监听dialogVisible变化，默认true
  /**
   * dialogVisible变化时的回调，可不传
   * @param visible 变化后的值
   */
  dialogVisibleCallback: (visible: boolean) => {
  },
  /**
   * selectList回调，可不传
   */
  selectListCallback: () => {
  },
  bulkOperation: true, // 弹出表单是否支持批量操作，默认false
  /**
   * 修改单个前的查询的回调，可不传，one2More为true时调这个
   */
  beforeUpdateOneCallback1: (res: any[]) => {
  },
  /**
   * 修改单个前的查询的回调，可不传，one2More为false时调这个
   */
  beforeUpdateOneCallback2: (res: any) => {
  }
})

const func: t_FuncMap = {
  /**
   * 查询列表
   * @param params
   */
  selectList: (params: any) => {
    return ${moduleName}Sel(params)
  },
  /**
   * 查询单个
   * @param id
   */
  selectById: (id: any) => {
    return ${moduleName}SelById(id)
  },
  /**
   * 查询多个
   * @param ids
   */
  selectByIds: (ids: any[]) => {
    return ${moduleName}SelByIds(ids)
  },
  /**
   * 新增
   * @param obj
   */
  insertOne: (obj: any) => {
    return ${moduleName}Ins(obj)
  },
  /**
   * 修改
   * @param obj
   */
  updateOne: (obj: any) => {
    return ${moduleName}Upd(obj)
  },
  /**
   * 新增多个
   * @param objs
   */
  insertMore: (objs: any[]) => {
    return ${moduleName}Inss(objs)
  },
  /**
   * 修改多个
   * @param objs
   */
  updateMore: (objs: any[]) => {
    return ${moduleName}Upds(objs)
  },
  /**
   * 删除
   * @param ids
   */
  deleteList: (...ids: any[]) => {
    return ${moduleName}Del(ids)
  }
}

const {
  refresh,
  dCan,
  dCon,
  fEnter,
  fCon,
  fCan,
  gRefresh,
  gIns,
  gUpd,
  gDel,
  gExport,
  gImport,
  tUpd,
  tDel,
  handleSelectionChange,
  pageChange,
  dfIns,
  dfDel,
  ifRequired
} = funcTablePage({
  config,
  state,
  state2,
  dialogFormRef,
  dialogFormsRef,
  filterFormRef,
  dialogVisible,
  dialogLoadingRef,
  tableLoadingRef,
  switchLoadingRef,
  activeTabName,
  func
})
</script>
` + `
<template>
  <!--弹框-->
  <el-dialog
      ${':'}width="activeTabName===final.more ? CONFIG.dialog_width_wider : CONFIG.dialog_width"
      v-model="dialogVisible"
      ${':'}title="state.dialogType.label"
      draggable
      append-to-body
  >
    <el-tabs v-if="config.bulkOperation" v-model="activeTabName">
      <el-tab-pane ${':'}disabled="state.dialogType.value===final.upd" label="操作单个" :name="final.one"></el-tab-pane>
      <el-tab-pane ${':'}disabled="state.dialogType.value===final.upd" label="操作多个" :name="final.more"></el-tab-pane>
    </el-tabs>
    <template v-if="activeTabName===final.one">
      <el-form
          ref="dialogFormRef"
          v-loading="dialogLoadingRef"
          ${':'}model="state.dialogForm"
          ${':'}label-width="CONFIG.dialog_form_label_width"
          ${':'}rules="state.dFormRules"
      >
        <!--<el-row>-->
        <!--  <el-col :span="12"></el-col>-->
        <!--  <el-col :span="12"></el-col>-->
        <!--</el-row>-->
        <el-form-item v-if="state.dialogType.value!==final.ins" ${':'}label="state.dict['id']" prop="id">
          <span>{{ state.dialogForm['id'] }}</span>
        </el-form-item>
        <!--
        第一个input添加如下属性
        v-focus
        -->
        <!--在此下方添加表单项-->
${
    columns
      .filter(item => item.ifIns === base.Y)
      .map((item, index) => `${qd3_dialogFormForm.find(funcs => funcs[0](item.formType, 0, 0))[1](item.tsName, index, columns.filter(item => item.ifIns === base.Y).length)}`)
      .join('\n')
  }
        ${'<!--在此上方添加表单项-->'}
        ${`<!--<el-form-item :label="state.dict['orderNum']" prop='orderNum'>-->`}
        ${`<!--  <el-input-number v-model="state.dialogForm['orderNum']" controls-position="right"/>-->`}
        ${`<!--</el-form-item>-->`}
        ${`<!--<el-form-item :label="state.dict['ifDefault']" prop='ifDefault'>-->`}
        ${`<!--  <el-switch v-model="state.dialogForm['ifDefault']" :active-value='final.IS_DEFAULT_YES' :inactive-value='final.IS_DEFAULT_NO'/>-->`}
        ${`<!--</el-form-item>-->`}
        ${`<!--<el-form-item :label="state.dict['ifDisabled']" prop='ifDisabled'>-->`}
        ${`<!--  <el-radio-group v-model="state.dialogForm['ifDisabled']">-->`}${`
        `}${`<!--    <el-radio :label="final.Y">是</el-radio>-->`}${`
        `}${`<!--    <el-radio :label="final.N">否</el-radio>-->`}${`
        `}${`<!--  </el-radio-group>-->`}${`
        `}${`<!--</el-form-item>-->`}${`
        `}${`<!--<el-form-item :label="state.dict['ifDisabled']" prop="ifDisabled">-->`}${`
        `}${`<!--  <el-switch v-model="state.dialogForm['ifDisabled']" :active-value="final.DISABLED_NO" :inactive-value="final.DISABLED_YES"/>-->`}${`
        `}${`<!--</el-form-item>-->`}${`
        `}${'<!--上方几个酌情使用-->'}${`
      `}${'</el-form>'}
    </template>
    <template v-if="activeTabName===final.more">
      <el-form
          ref="dialogFormsRef"
          v-loading="dialogLoadingRef"
      >
        <el-table
            ${':'}data="state.dialogForms"
            v-if="state.dialogForms"
        >
          <el-table-column type="index" width="50">
            <template ${'#'}header>
              #
            </template>
          </el-table-column>
          <!--在此下方添加表格列-->${
    columns
      .filter(item => item.ifIns === base.Y)
      .map((item, index) => `${qd3_dialogFormForm.find(funcs => funcs[0](item.formType, 0, 0))[2](item.tsName, index, columns.filter(item => item.ifIns === base.Y).length)}`)
      .join('')
  }
          <!--在此上方添加表格列-->
          <el-table-column fixed="right" label="操作" min-width="120">
            <template v-if="state.dialogType.value===final.ins" ${'#'}default="{$index}">
              <el-button link type="danger" size="small" ${'@'}click="dfDel($index)">删除</el-button>
            </template>
          </el-table-column>
          <template v-if="state.dialogType.value===final.ins" ${'#'}append>
            <el-button text type="primary" plain :icon="Plus" @click="dfIns">新增</el-button>
          </template>
        </el-table>
      </el-form>
    </template>
    <template ${'#'}footer>
      <span class="dialog-footer">
        <el-button @click="dCan">取消</el-button>
        <el-button type="primary" ${'@'}click="dCon">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <!--顶部筛选表单-->
  <el-form
      class="demo-form-inline"
      v-if="Object.keys(state.filterForm).length>0"
      ref="filterFormRef"
      ${':'}model="state.filterForm"
      :inline="true"
      @keyup.enter="fEnter"
  >
    ${`<!--在此下方添加表单项-->`}
    ${`<!--<el-form-item :label="state.dict['']" prop="">-->`}
    ${`<!--  <el-input v-model="state.filterForm['']" :placeholder="state.dict['']"/>-->`}
    ${`<!--</el-form-item>-->`}
    ${`<!--在此上方添加表单项-->`}
    <el-form-item>
      <el-button type="primary" @click="fCon">筛选</el-button>
      <el-button ${'@'}click="fCan">重置</el-button>
    </el-form-item>
  </el-form>

  <!--操作按钮-->
  <div>
    <!--<el-button-group>-->
    <el-button type="primary" plain ${':'}icon="Refresh" @click="gRefresh">刷新</el-button>
    <el-button type="primary" plain ${':'}icon="Plus" @click="gIns">新增</el-button>
    <el-button type="success" plain ${':'}icon="Edit" :disabled="config.bulkOperation?state.multipleSelection.length===0:state.multipleSelection.length!==1" @click="gUpd">修改</el-button>
    <el-button type="danger" plain ${':'}icon="Delete" :disabled="state.multipleSelection.length===0" @click="gDel()">删除</el-button>
    <el-button type="warning" plain ${':'}icon='Download' :disabled='state.multipleSelection.length===0' @click="gExport">导出</el-button>
    <el-button type="warning" plain ${':'}icon='Upload' @click="gImport">上传</el-button>
    ${`<!--</el-button-group>-->`}
    ${`<!--<el-button-group>-->`}${`
    `}${`<!--  <el-button plain :disabled="state.multipleSelection.length===0" @click="gMoveUp">上移</el-button>-->`}${`
    `}${`<!--  <el-button plain :disabled="state.multipleSelection.length===0" @click="gMoveDown">下移</el-button>-->`}${`
    `}${`<!--</el-button-group>-->`}${`
    `}${`<!--<el-button-group>-->`}${`
    `}${`<!--  <el-button plain :disabled="state.multipleSelection.length===0" @click="gDisabledToNo">启用</el-button>-->`}${`
    `}${`<!--  <el-button plain :disabled="state.multipleSelection.length===0" @click="gDisabledToYes">禁用</el-button>-->`}${`
    `}${`<!--  <el-button plain :disabled="state.multipleSelection.length===0" @click="gDisabledShift">切换</el-button>-->`}${`
    `}${`<!--</el-button-group>-->`}${`
  `}${'</div>'}

  <!--数据表格-->
  <el-table
      v-loading="tableLoadingRef"
      ${':'}data="state.list"
      ${'@selection-change="handleSelectionChange"'}
  >
    <el-table-column fixed type="selection" width="55"/>
    ${`<!--<el-table-column fixed prop="id" :label="state.dict[\'id\']" width="180"/>-->`}
    ${`<!--上面id列的宽度改一下-->`}
    ${`<!--在此下方添加表格列-->`}
${
    columns
      .filter(item => item.ifSelOne === base.Y)
      .map(item => `    <el-table-column prop="${item.tsName}" :label="state.dict['${item.tsName}']" width="120"/>`,
      )
      .join('\n')
  }
    ${`<!--在此上方添加表格列-->`}
    ${`<!--<el-table-column prop="createBy" :label="state.dict[\'createBy\']" width="120"/>-->`}
    ${`<!--<el-table-column prop="updateBy" :label="state.dict[\'updateBy\']" width="120"/>-->`}
    ${`<!--<el-table-column prop="createTime" :label="state.dict[\'createTime\']" width="220"/>-->`}
    ${`<!--<el-table-column prop="updateTime" :label="state.dict[\'updateTime\']" width="220"/>-->`}
    ${`<!--<el-table-column prop="deleted" :label="state.dict[\'deleted\']" width="60"/>-->`}
    ${`<!--上方几个酌情使用-->`}
    ${'<el-table-column fixed="right" label="操作" min-width="120">'}
      <template #default="{row}">
        <el-button link type="primary" size="small" @click="tUpd(row.id)">修改</el-button>
        <el-button link type="danger" size="small" ${'@'}click="tDel(row.id)">删除</el-button>
      </template>
    </el-table-column>
    <template ${'#'}append>
      <span>此表格的多选<span class="underline">不支持</span>{{ \`跨分页保存，当前已选 \${state.multipleSelection.length} 条数据。\` }}</span>
    </template>
  </el-table>

  <!--分页-->
  <Pagination
      v-if="state.total!==-1"
      ${':total="Number(state.total)"'}
      ${':page-num="state.pageParam.pageNum"'}
      ${':page-size="state.pageParam.pageSize"'}
      ${'@page-change="pageChange"'}
  />
</template>
` + `
<style scoped>
</style>`;
  const fileNames = {
    hd1: `${toKebabCase(moduleName)}.controller.ts`,
    hd2: `${toKebabCase(moduleName)}.service.ts`,
    hd3: `dto.ts`,
    hd4: `${toKebabCase(moduleName)}.module.ts`,
    hd5: `app.module.ts`,
    qd1: `${moduleName}.ts`,
    qd2: `${moduleName}.ts`,
    qd3: `index.vue`,
  };
  const filePaths = {
    hd1: `/src/module/${toKebabCase(businessName)}/${toKebabCase(moduleName)}`,
    hd2: `/src/module/${toKebabCase(businessName)}/${toKebabCase(moduleName)}`,
    hd3: `/src/module/${toKebabCase(businessName)}/${toKebabCase(moduleName)}`,
    hd4: `/src/module/${toKebabCase(businessName)}/${toKebabCase(moduleName)}`,
    hd5: '',
    qd1: `/src/api/module/${businessName}`,
    qd2: `/src/type/api/${businessName}`,
    qd3: `/src/views/${businessName}/${moduleName}`,
  };
  return {
    fileNames: fileNames,
    filePaths: filePaths,
    codes: {
      hd1,
      hd2,
      hd3,
      hd4,
      hd5,
      qd1,
      qd2,
      qd3,
    },
  };
}
