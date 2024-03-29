
const {Model,DataTypes} = require('sequelize')
// 导入数据实例
const sequelize = require('../database/database')
// 定义 SystemMenu 类，并继承 Sequelize.Model
class SystemMenu  extends Model {}
// 初始化 SystemMenu 模型，定义其结构和设置
SystemMenu.init({
    // 定义 id 字段 自动生成 uuid 并设置为主键
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
    },
    menu_name:{
        // 定义 菜单名称 字段作为 字符串类型 不允许为空 并且在表中必须唯一
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
            notEmpty:true// 验证器，确保 menu_name 不为空字符串
        }
    },
    menu_address:{
        // 定义 菜单路径 字段为 字符串类型 并且在表中必须唯一
        type:DataTypes.STRING,
       unique:true,
      
    },
    route_address:{
         // 定义 菜单路径 字段为 字符串类型  并且在表中必须唯一
         type:DataTypes.STRING,
         unique:true,
         
    },
    parent_id:{
        // 定义 路由父ID 字段为 字符串类型 
        type:DataTypes.STRING,
        defaultValue:'',
        
    },
    sort:{
        // 定义 排序 字段为 数值类型
        type:DataTypes.NUMBER,
        defaultValue:'',
        
    },
    menu_type:{
        // 定义 菜单路径 字段为 字符串类型 不允许为空 
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:'1',
   },
    hidden:{
        // 定义 是否隐藏 字段
        type:DataTypes.BOOLEAN,
        defaultValue:false
       
    },
    enabled:{
        // 定义 是否启用 字段 
        type:DataTypes.BOOLEAN,
        defaultValue:false
      
    }
},{
    sequelize,// 指向已经实例化的 Sequelize 实例
    modelName:'SystemMenu', // 设置在 Sequelize 中使用的模型名称
    tableName:'system_menus',// 设置对应的数据库表名称
    timestamps:true,// 启用 Sequelize 的时间戳功能，自动添加 createdAt 和 updatedAt 字段
    // 钩子 (Hooks) 允许在生命周期事件发生时执行自定义逻辑
    hooks:{
        beforeCreate:(user,option) => {
            // console.log(user);
            // console.log(option);
        }
    }

})

module.exports = SystemMenu