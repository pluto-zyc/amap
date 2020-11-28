<template>
  <el-main>
    <div class="modle">
      <el-form
        :inline="true"
        ref="form"
        :model="form"
        label-width="120px"
        :hideRequiredAsterisk="true"
      >
        <el-form-item
          label="方案名称:"
          :rules="[
          { required: true, message: '方案名称不能为空'},
          { type: 'number', message: '年龄必须为数字值'}
         ]"
        >
          <el-input v-model="form.name" class="fangan"></el-input>
        </el-form-item>

        <div>
          <el-form-item
            label="事故位置经纬度:"
            label-width="120px"
            class="jinweidu"
            :rules="[
         { required: true, message: '事故位置经纬度不能为空'},
         { type: 'number', message: '年龄必须为数字值'}
         ]"
          >
            <el-input placeholder="经度" v-model="form.lng"></el-input>
            <el-input placeholder="维度" v-model="form.lat"></el-input>
          </el-form-item>
        </div>

        <el-form-item label="事故情景:" label-width="120px">
          <el-select v-model="form.accident_case_info">
            <el-option label="液池蒸发" value="液池蒸发"></el-option>
            <el-option label="常温常压液体容器" value="常温常压液体容器"></el-option>
            <el-option label="压力气体容器" value="压力气体容器"></el-option>
            <el-option label="压力液化气容器" value="压力液化气容器"></el-option>
            <el-option label="低温液化气容器" value="低温液化气容器"></el-option>
          </el-select>
          <div v-if="form.accident_case_info=='液池蒸发'?true:false" style="display:inline">
            <el-form-item label="蒸发类型:">
              <!-- <span class="span_leixin">蒸发类型</span> -->
              <el-select v-model="form.vapor_type_info">
                <el-option label="闪蒸" value="闪蒸"></el-option>
                <el-option label="质量蒸发" value="质量蒸发"></el-option>
                <el-option label="质量蒸发+热量蒸发" value="质量蒸发+热量蒸发"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>

        <v-addModle1 :form="form" v-if="form.accident_case_info=='液池蒸发'"></v-addModle1>
        <v-addModle2 :form="form" v-if="form.accident_case_info=='常温常压液体容器'"></v-addModle2>
        <v-addModle3 :form="form" v-if="form.accident_case_info=='压力气体容器'"></v-addModle3>

        <div class="button_item">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button type="info" @click="clear">重置</el-button>
            <!-- <input type="reset" /> -->
          </el-form-item>
        </div>
      </el-form>

      <el-table border :data="tableData" style="width: 100%" v-if="data.length>0">
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
      </el-table>

      <el-table border :data="tableData" style="width: 100%" v-if="data1.length>0">
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
      </el-table>
    </div>
  </el-main>
</template>
<script>
import vAddModle1 from "./component/addModle1.vue";
import vAddModle2 from "./component/addModle2.vue";
import vAddModle3 from "./component/addModle3.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    vAddModle1,
    vAddModle2,
    vAddModle3,
  },
  props: ["info"],
  data() {
    return {
      data: [],
      data1: [],
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
      ],
      form: {
        name: "",
        lng: "",
        lat: "",
        accident_case_info: "液池蒸发",
        vapor_type_info: "闪蒸",
        info1: {
          atm_P0: "11111111111", //环境压力
          atm_u: "", //环境风速
          container_T: "", //储存温度
          chemical_M: "", //物质的分子量
          liquid_density: "", //液体密度
          liquid_H: "", //液体汽化热sssss
          liquid_Tb: "", //常压沸点
          liquid_Cp: "", //液体定压比热容
          mass_total: "", //物质泄漏总量，单位kg
          pool_area: "", //液池面积
        },
        info2: {
          atm_P0: "2222222222", //环境压力
          atm_u: "", //环境风速
          container_T: "", //储存温度
          chemical_M: "", //物质的分子量
          liquid_density: "", //液体密度
          liquid_H: "", //液体汽化热sssss
          liquid_Tb: "", //常压沸点
          liquid_Cp: "", //液体定压比热容
          mass_total: "", //物质泄漏总量，单位kg
          pool_area: "", //液池面积
        },
        info3: {
          atm_P0: "333333333333333333333", //环境压力
          atm_u: "", //环境风速
          container_T: "", //储存温度
          chemical_M: "", //物质的分子量
          liquid_density: "", //液体密度
          liquid_H: "", //液体汽化热sssss
          liquid_Tb: "", //常压沸点
          liquid_Cp: "", //液体定压比热容
          mass_total: "", //物质泄漏总量，单位kg
          pool_area: "", //液池面积
        },
      },
    };
  },
  //  watch:{
  //    data(){

  //    }
  //  },
  computed: {},
  methods: {
    // 清空
    clear() {
      this.form = {
        name: "",
        lng: "",
        lat: "",
        accident_case_info: "液池蒸发",
        vapor_type_info: "闪蒸",
        info1: {
          atm_P0: "11111111111", //环境压力
          atm_u: "", //环境风速
          container_T: "", //储存温度
          chemical_M: "", //物质的分子量
          liquid_density: "", //液体密度
          liquid_H: "", //液体汽化热sssss
          liquid_Tb: "", //常压沸点
          liquid_Cp: "", //液体定压比热容
          mass_total: "", //物质泄漏总量，单位kg
          pool_area: "", //液池面积
        },
        info2: {
          atm_P0: "2222222222", //环境压力
          atm_u: "", //环境风速
          container_T: "", //储存温度
          chemical_M: "", //物质的分子量
          liquid_density: "", //液体密度
          liquid_H: "", //液体汽化热sssss
          liquid_Tb: "", //常压沸点
          liquid_Cp: "", //液体定压比热容
          mass_total: "", //物质泄漏总量，单位kg
          pool_area: "", //液池面积
        },
        info3: {
          atm_P0: "333333333333333333333", //环境压力
          atm_u: "", //环境风速
          container_T: "", //储存温度
          chemical_M: "", //物质的分子量
          liquid_density: "", //液体密度
          liquid_H: "", //液体汽化热sssss
          liquid_Tb: "", //常压沸点
          liquid_Cp: "", //液体定压比热容
          mass_total: "", //物质泄漏总量，单位kg
          pool_area: "", //液池面积
        },
      };
    },
    // 点击提交
    onSubmit() {
      // var data = this.form;
      // console.log(data);
      // console.log(data);
      // this.data.push(123)
      // // this.data1.push(123)
      //  this.info.isShow = true
      //  this.info.msg = "请稍等~"
      //  if(data.length>0){
      //    this.info.isShow = false
      //  }
    },
  },
  mounted() {},
  beforeDestroy() {},
};
</script>
<style scoped>
.modle {
  width: 1080px;
  margin: 0 auto;
}
.modle .el-form {
  /* width: 770px; */
  /* margin: 0 auto; */
}
.modle .el-input {
  /* width: 00px; */
}
.modle .span_leixin {
  font-size: 14px;
  line-height: 40px;
  display: inline-block;
  margin-left: 10px;
}
.modle /deep/ .el-form-item {
  /* margin-bottom: 20px; */
  /* width: 600px; */
}
.modle /deep/ .el-select {
  width: 180px;
}

.modle .fangan {
  width: 373px;
}

.modle .button_item {
  padding: 20px 0;
  width: 600px;
  margin: 0 auto;
  text-align: center;
}
.modle {
}
</style>
