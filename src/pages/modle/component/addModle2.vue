<template>
  <ul class="modle_add2">
    <h3>环境参数</h3>

    <el-form-item label="环境气压PO(Pa):" label-width="180px" label-position="right">
      <el-input v-model="form.info2.atm_P0"></el-input>
    </el-form-item>
    <el-form-item label="环境风速u(m/s):" label-width="180px" label-position="right">
      <el-input v-model="form.info2.atm_u"></el-input>
    </el-form-item>

    <h3>容器参数</h3>

    <el-form-item label="储存温度:" label-width="180px" label-position="right">
      <el-input v-model="form.info2.container_T"></el-input>
    </el-form-item>

    <h3>物料性质</h3>

    <el-form-item label="分子量M(kg/mol):" label-width="180px" label-position="right">
      <el-input v-model="form.info2.chemical_M"></el-input>
    </el-form-item>
    <el-form-item label="液体密度PHOSL(kg/m3):" label-width="180px" label-position="right">
      <el-input v-model="form.info2.liquid_density"></el-input>
    </el-form-item>
    <el-form-item label="沸点时液体汽化热DHE(J/kg):" label-width="180px" label-position="right">
      <el-input v-model="form.info2.liquid_H"></el-input>
    </el-form-item>
    <el-form-item label="常压沸点TBP(K):" label-width="180px" label-position="right">
      <el-input v-model="form.info2.liquid_Tb"></el-input>
    </el-form-item>
    <el-form-item label="液体定压比热容CPSL(J/kg*K):" label-width="180px" label-position="right">
      <el-input v-model="form.info2.liquid_Cp"></el-input>
    </el-form-item>

    <h3>蒸发参数</h3>

    <el-form-item label="物质泄漏总量(kg):" label-width="180px" label-position="right">
      <el-input v-model="form.info2.mass_total"></el-input>
    </el-form-item>
    <el-form-item label="液池面积(m3):" label-width="180px" label-position="right">
      <el-input v-model="form.info2.pool_area"></el-input>
    </el-form-item>
  </ul>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["form"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapGetters({}),
  },
  mounted() {},
  beforeDestroy() {},
};
</script>
<style scoped>
.modle_add2 {
  width: 1080px;
}
.modle_add2 li {
  width: 100%;
  /* display: flex; */
  /* justify-content: space-between; */
  /* flex-wrap:wrap ; */
}

.modle_add2 /deep/ .el-input {
  width: 340px;
}
.modle_add2 /deep/ .el-form-item {
  /* width: 900px; */
}
.modle_add2 {
}
.modle_add2 {
}
.modle_add2 {
}
.modle_add2 {
}
.modle_add2 {
}
.modle_add2 {
}
.modle_add2 {
}
</style>