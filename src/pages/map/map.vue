<template>
  <div class="map" style="height:calc(100vh - 60px)" ref="map_ref">
    <el-amap
      vid="amapDemo"
      :center="center"
      :map-manager="AMapManager"
      :zoom="zoom"
      :events="events"
      class="amap-demo"
      ref="getImg"
    >
      <!-- 国市区控站点标记 -->
      <div
        v-if="countryMarkerList.length>0 && i.checked?true:false"
        v-for="i in countryMarkerList"
        :key="i.siteName"
      >
        <el-amap-marker
          v-for="(marker, index) in i.children"
          :key="marker.name"
          :position="[marker.lng,marker.lat]"
          :visible="true"
          :vid="index"
          :title="marker.name"
          :events="marker.events"
        ></el-amap-marker>
      </div>
      <!-- 详情页面过来的坐标点 -->

      <el-amap-marker
        v-if="starPoint.lng!=undefined?true:false"
        :position="[starPoint.lng,starPoint.lat]"
        :visible="true"
        :title="starPoint.name"
        :events="starPoint.events"
      ></el-amap-marker>

      <!-- image图片插入 -->
      <el-amap-ground-image
        opacity=".7"
        v-if="bounds.length>0&&groundImgShow"
        :url="groundImg"
        :bounds="bounds"
      ></el-amap-ground-image>
      <!--污染源" -->
      <div
        v-if="pointList.length>0 && i.checked?true:false"
        v-for="i in pointList"
        :key="i.siteName"
      >
        <el-amap-marker
          v-for="(marker, index) in i.children"
          :key="marker.name"
          :position="[marker.lng,marker.lat]"
          :visible="true"
          :vid="index"
          :title="marker.name"
          :events="marker.events"
        ></el-amap-marker>
      </div>

      <el-amap-info-window
        :offset="[0,-30]"
        v-if="infoPosition.length>0&&showInfoWindow?true:false"
        :position="infoPosition"
        :visible="showInfoWindow"
      >
        <ul>
          <h4>名称：{{ infoWindow.name}}</h4>
          <li>地址：{{ infoWindow.address}}</li>
          <li>经度：{{ infoWindow.lng}}</li>
          <li>维度：{{ infoWindow.lat}}</li>
          <el-link @click="bindPointToDetail(infoWindow.name)" type="primary">详情~</el-link>
        </ul>
      </el-amap-info-window>
    </el-amap>
    <!-- 地图navbar -->
    <div class="navBarBox">
      <el-radio-group v-model="isCollapse" style="margin-bottom: 5px;">
        <el-radio-button :label="false">展开</el-radio-button>
        <el-radio-button :label="true">收起</el-radio-button>
      </el-radio-group>
      <el-menu
        :unique-opened="true"
        @select="changMenu"
        default-active="1-4-1"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        background-color="rgba(0,0,0,.6)"
        text-color="#fff"
        active-text-color="#fff"
      >
        <!-- 国控站 -->
        <el-submenu index="0">
          <template slot="title">
            <i class="el-icon-star-on"></i>
            <span slot="title">国控站</span>
          </template>
          <el-menu-item index="0-0" v-if="countryMarkerList.length>0">
            <el-checkbox
              v-model="countryMarkerList[0].checked"
              label="国控站"
              style="color:#fff"
              @click="changeCountry"
              :checked="countryMarkerList[0].checked"
            ></el-checkbox>
          </el-menu-item>
        </el-submenu>

        <!-- 第一级 市控站-->
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-caret-top"></i>
            <span slot="title">市控站</span>
          </template>
          <el-menu-item index="1-0" v-if="countryMarkerList.length>0">
            <el-checkbox
              v-model="countryMarkerList[1].checked"
              label="市控站"
              style="color:#fff"
              @click="changeCounty"
              :checked="countryMarkerList[1].checked"
            ></el-checkbox>
          </el-menu-item>
        </el-submenu>

        <!-- 县控站 -->
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-s-cooperation"></i>
            <span slot="title">县控站</span>
          </template>
          <el-menu-item index="0-0">
            <el-checkbox label="县控站" style="color:#fff"></el-checkbox>
          </el-menu-item>
        </el-submenu>
        <!-- 污染源分级 -->
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">污染源</span>
          </template>
          <div class="wuran">
            <el-menu-item
              :index="'3-'+index"
              v-show="pointList.length>0?true:false"
              v-for="(i,index) in pointList"
              :key="i.lat"
            >
              <el-checkbox
                v-model="i.checked"
                :label="i.siteName"
                style="color:#fff"
                @click="bindChecked(index)"
                :checked="i.checked"
              />
            </el-menu-item>
          </div>
        </el-submenu>
        <!-- 设置 -->
        <el-submenu index="6">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">设置</span>
          </template>

          <!-- 设置地图样式 -->
          <el-submenu index="6-2">
            <template slot="title">
              <!-- <i class="el-icon-setting"></i> -->
              <span slot="title">地图样式</span>
            </template>
            <el-menu-item index="6-2-1">
              <span style="color:#fff">标准样式</span>
            </el-menu-item>
            <el-menu-item index="6-2-2">
              <span style="color:#fff">清新蓝</span>
            </el-menu-item>
            <el-menu-item index="6-2-3">
              <span style="color:#fff">黑夜模式</span>
            </el-menu-item>
            <el-menu-item index="6-2-4">
              <span style="color:#fff">自然绿</span>
            </el-menu-item>
            <el-menu-item index="6-2-5">
              <span style="color:#fff">青春绿</span>
            </el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
    </div>
    <!-- 播放控件 -->
    <div class="hig">
      <div class="svgBox">
        <div class="left" @click="bingImage">
          <img
            style="zIndex:99999999999999999"
            v-if="showImage"
            src="/static/image/video_hig.png"
            class="video_img"
            alt="播放"
          />
          <img
            style="zIndex:99999999999999999"
            v-else
            class="video_img"
            src="/static/image/video_nor.png"
            alt="播放"
          />
        </div>
        <div class="right">
          <svg>
            <g id="text">
              <text
                id="svg_text"
                @click="bindText(index)"
                v-for="(i,index) in textArr"
                :key="i"
                :x="38*(index+1)"
                y="22"
                style="text-anchor: middle;fill:white;cursor:pointer;font-size:12px"
              >{{i}}</text>
            </g>
          </svg>
        </div>
        <div class="uitil" :style="{left:hkleft+'px'}">
          <i class="after"></i>
          <span style="color:white">{{hktext}}</span>
        </div>
        <div class="rule">
          <button @click="openDistanceTool">开启测距</button>
          <button @click="bindShowHeatMap">{{showHeatText}}</button>
        </div>
      </div>
    </div>
    <!-- <img :src="groundImg" alt />
    <button @click="getMap">anniu</button>-->
    <span class="clear" @click="clear">清空坐标</span>
  </div>
</template>
  <script>
import * as d3 from "d3";
import { keduFun } from "../../utils/svg_kedu";

import {
  requestCenterMarker,
  requestCountryMarker,
} from "../../utils/request.js";
import demo from "../../utils/asset/demo.json";
import { mapActions, mapGetters } from "vuex";
import qs from "qs";
import { AMapManager } from "vue-amap";
import { warningAlert } from "../../utils/alert";

export default {
  props: ["info", "heatList"],
  data() {
    return {
      plugin: [
        //当前单个地图需要的配置插件
        {
          //定位插件配置
          pName: "Geolocation",
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              console.log(o);
              // o.getCurrentPosition((status, result) => {
              //   if (result && result.position) {
              //     console.log(result);
              //     self.lng = result.position.lng;
              //     self.lat = result.position.lat;
              //     self.center = [self.lng, self.lat];
              //     self.loaded = true;
              //     self.$nextTick();
              //   }
              // });
            },
          },
        },
        {
          //左边工具条

          pName: "ToolBar",
          defaultType: 0,
          events: {
            init(o) {
              // console.log(o);
            },
          },
        },
        {
          //卫星/地图
          pName: "MapType",
          defaultType: 0,
          events: {
            init(o) {
              // console.log(o);
            },
          },
        },
        {
          //鹰眼插件
          pName: "OverView",
          events: {
            init(instance) {
              console.log(instance);
            },
          },
        },
        {
          //标尺
          pName: "Scale",
          events: {
            init(instance) {
              console.log(instance);
            },
          },
        },
      ],
      showHeatText: "显示热力图",
      countryMarkerList: [], //国市控站markers
      groundImgShow: false, //控制热图显示
      groundImg: "",
      //  this.$img+this.heatList[0]
      bounds: [],
      pointIndex: "",
      isCollapse: true, // 控制导航收起隐藏
      zoom: 12,
      center: [114.81961, 34.8235],
      AMapManager: AMapManager, //地图管理对象
      events: {
        init(o) {
          // 同时引入工具条插件，比例尺插件和鹰眼插件
          AMap.plugin(
            [
              "AMap.ToolBar",
              "AMap.Scale",
              "AMap.OverView",
              "AMap.MapType",
              "AMap.Geolocation",
            ],
            function () {
              // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
              o.addControl(new AMap.ToolBar());

              // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
              o.addControl(
                new AMap.Scale({
                  position: "lb", //left bottom, 左下角
                  top: "10px",
                  right: "20px"
                })
              );

              // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
              o.addControl(new AMap.OverView({ isOpen: true }));

              // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
              o.addControl(new AMap.MapType());

              // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
              o.addControl(new AMap.Geolocation());
            }
          );

          var opts = {
            subdistrict: 0, //获取边界不需要返回下级行政区
            extensions: "all", //返回行政区边界坐标组等具体信息
            level: "district", //查询行政级别为 市
          };
          let district = new AMap.DistrictSearch(opts);
          //行政区查询
          district.setLevel("district");
          district.search("兰考", function (status, result) {
            var polygons = [];
            var bounds = result.districtList[0].boundaries;
            if (bounds) {
              for (var i = 0, l = bounds.length; i < l; i++) {
                //生成行政区划polygon
                var polygon = new AMap.Polygon({
                  strokeWeight: 2,
                  strokeStyle: "dashed",
                  path: bounds[i],
                  fillOpacity: 0.4,
                  fillColor: "transparent",
                  strokeColor: "blue",
                });
                polygons.push(polygon);
              }
            }
            o.add(polygons);
            o.setFitView(polygons); //视口自适应
          });
        },
        // init: (o) => {
        //   AMapUI.loadUI(["overlay/SimpleMarker"], function (SimpleMarker) {
        //     const marker = new SimpleMarker({
        //       iconLabel: "A",
        //       iconStyle: "red",
        //       map: o,
        //       position: o.getCenter(),
        //     });
        //   });
        // },
      },
      infoPosition: [],
      infoWindow: {},
      showInfoWindow: false,
      starPoint: {},
      showImage: false, //控制播放按钮
      timer1: null,
      timer2: null,
      m: 0, //控制刻度条
      hktext: "01:00", //滑块text
      hkleft: 40, //刻度尺滑块left
      textArr: [
        //刻度text
        "1点",
        "2点",
        "3点",
        "4点",
        "5点",
        "6点",
        "7点",
        "8点",
        "9点",
        "10点",
        "11点",
        "12点",
        "13点",
        "14点",
        "15点",
        "16点",
        "17点",
        "18点",
        "19点",
        "20点",
        "21点",
        "22点",
        "23点",
        "00点",
      ],
    };
  },
  computed: {
    ...mapGetters({
      pointList: "map/list",
    }),
  },
  watch: {
    // infoPosition() {
    //   this.showInfoWindow = true;
    // },
    // 污染源
    pointList() {
      var that = this;
      this.pointList.forEach((i) => {
        i.children.forEach((item, index) => {
          item.events = {
            click: () => {
              that.showInfoWindow = false;
              that.$nextTick(() => {
                var all = i.children[index];
                that.infoWindow = all;
                that.pointIndex = all.name;
                that.infoPosition = [all.lng, all.lat];
                that.showInfoWindow = true;
                console.log(all);
              });
            },
          };
        });
      });
    },
  },
  methods: {
    // 点击清空所有左边点
    clear() {
      this.showInfoWindow = false;
      this.countryMarkerList.forEach((i) => {
        //清空国县市控站

        i.checked = false;
      });
      this.starPoint = {}; //详情坐标
      this.pointList.forEach((i) => {
        //q清空污染源
        i.checked = false;
      });
    },
    // 关闭infowindow
    closeInfoWindow() {
      this.infoPosition = [];
      this.showInfoWindow = false;
    },
    // 控制测距工具
    openDistanceTool() {},

    // 点击国控站坐标 点
    bindCountryPoint(name) {
      this.starInfoWindow = false;
      this.infoIndex = "";
      this.countryIndex = name;
    },
    // 点击信息窗口详情 去往详情
    bindPointToDetail(name) {
      this.info.isShow = true;
      this.info.msg = "已经很努力啦，请稍等~";
      this.$router.push({ name: "impEnter", params: { id: name } });
    },
    // 点击显示热力图
    bindShowHeatMap(e) {
      if (this.groundImgShow) {
        this.groundImgShow = false;
        this.showHeatText = "开启热力图";
        return;
      }
      this.groundImgShow = true;
      this.showHeatText = "关闭热力图";
    },
    // 点击刻度时间
    bindText(index, left, text) {
      if (this.groundImgShow) {
        this.groundImgShow = false;
      }
      this.$nextTick(() => {
        if (this.heatList.length == 0) {
          warningAlert("请选择模型");
          return;
        }
        clearInterval(this.timer2);
        //展示热力图

        this.showImage = false; //关闭播放暂停按钮
        // 控制滑块移动
        this.hkleft = index * 38 + 40;
        console.log(this.$refs.getImg.$$getInstance());
        this.groundImgShow = true;
        this.groundImg = this.$img + this.heatList[index];
        this.hktext =
          Math.floor(index) + 1 < 10
            ? "0" + (Math.floor(index) + 1) + ":" + "00"
            : Math.floor(index) + 1 + ":" + "00";
        // 关联变量
        this.m = Math.floor(index) + 1;
        // setTimeout(() => {
        //    this.groundImgShow = false
        // }, 1000);
        console.log(this.groundImg);
        console.log(this.bounds);
      });

      // }, 0);
    },
    // 点击播放按钮播放热力图 并且滑块跟着移动
    bingImage() {
      if (this.heatList.length == 0) {
        warningAlert("清选择模型");
        return;
      }
      //展示热力图
      this.showImage = !this.showImage; //切换播放暂停按钮
      if (!this.showImage) {
        clearInterval(this.timer2);
        return;
      }

      this.timer2 = setInterval(() => {
        if (this.groundImgShow) {
          this.groundImgShow = false;
        }
        this.$nextTick(() => {
          if (this.m > this.heatList.length - 1) {
            //到达23
            clearInterval(this.timer2);
            this.showImage = false; //切换播放/暂停按钮
            this.groundImgShow = false;
            this.groundImg = "";
            this.hkleft = 40;
            this.hktext = "01:00";
            this.m = 0;
            return;
          }
          this.groundImgShow = true;
          this.groundImg = this.$img + this.heatList[this.m];
          this.hkleft = this.m * 38 + 40;
          this.hktext =
            Math.floor(this.m) + 1 < 10
              ? "0" + (Math.floor(this.m) + 1) + ":" + "00"
              : Math.floor(this.m) + 1 + ":" + "00";
          this.m++;
          console.log(this.groundImg);
        });
      }, 2000);

      console.log(this.groundImg);
    },
    // 点击污染源类型 切换坐标点
    bindChecked(index) {
      this.info.isShow = true;
      this.info.msg = "已经很努力啦，请稍等~";
      var obj = this.pointList[index];
      obj.checked = !obj.checked;
      this.$set(this.pointList, index, obj);
      this.$nextTick(() => {
        this.info.isShow = false;
      });
      // that.$forceUpdate(); //强制刷新
    },
    // 点击国控站
    changeCountry() {
      this.countryMarkerList[0].checked = !this.countryMarkerList[0].checked;
    },
    // 点击市控站
    changeCounty() {
      this.countryMarkerList[1].checked = !this.countryMarkerList[1].checked;
    },
    // 选中导航菜单项
    changMenu(key) {
      var index = Math.floor(key.slice(2));
      var ak = key.slice(0, 1);
      if (key == 0) {
      }
      if (key == 1) {
      }
      if (key == 2) {
      }
    },
    ...mapActions({
      pointsRequest: "map/responseList",
    }),
    // 测试事件
    // getMap() {
    //   this.showInfoWindow = !this.showInfoWindow;
    //   this.groundImg = this.$img + this.heatList[0];
    // },
  },
  mounted() {
    var that = this;
    // 从详情页面过来
    if (this.$route.query.id && this.pointList.length > 0) {
      this.pointList.map((i) => {
        var result = i.children.map((item) => {
          if (item.name == this.$route.query.id) {
            var all = item;
            that.infoWindow = all;
            that.pointIndex = all.name;
            that.infoPosition = [all.lng, all.lat];
            that.showInfoWindow = true;
            item.events = {
              click: () => {
                that.showInfoWindow = false;
                that.$nextTick(() => {
                  var all = item;
                  that.infoWindow = all;
                  that.pointIndex = all.name;
                  that.infoPosition = [all.lng, all.lat];
                  that.showInfoWindow = true;
                  console.log(that.showInfoWindow);
                });
              },
            };
            that.starPoint = item;
            this.info.isShow = false;
          }
        });
      });
    }
    // 请求坐下右上中心点
    requestCenterMarker().then((res) => {
      this.bounds = res.data;
    });

    //  给国控站添加event事件
    this.pointList.forEach((i) => {
      i.children.forEach((item, index) => {
        item.events = {
          click: () => {
            that.showInfoWindow = false;
            that.$nextTick(() => {
              var all = i.children[index];
              that.infoWindow = all;
              that.pointIndex = all.name;
              that.infoPosition = [all.lng, all.lat];
              that.showInfoWindow = true;
              console.log(all);
            });
          },
        };
      });
    });

    // 请求污染源坐标点
    if (this.pointList.length == 0) {
      this.pointsRequest();
    }

    // 请求 国市县控站
    requestCountryMarker().then((res) => {
      var that = this;
      res.data.forEach((i) => {
        i.children.forEach((item, index) => {
          item.events = {
            click: () => {
              this.showInfoWindow = false;
              this.$nextTick(() => {
                var all = i.children[index];
                that.infoWindow = all;
                that.pointIndex = all.name;
                that.infoPosition = [all.lng, all.lat];
                that.showInfoWindow = true;
                console.log(that.showInfoWindow);
              });
            },
          };
        });
      });
      this.countryMarkerList = res.data;
    });

    //  调用地图底部刻度尺
    var svg = d3.select("svg").attr("width", "950").attr("height", "50");
    keduFun(svg);
  },
};
</script>

<style scoped>
/* 标注  clear */
.clear {
  position: absolute;
  right: 20px;
  top: 150px;
  background: #438eb9;
  display: block;
  width: 60px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  color: #fff;
}
/* 地图下方刻度控件 */
.hig {
  position: absolute;
  bottom: 0px;
  left: 0px;

  z-index: 99999999999999999999999999999999999;
}
.hig .rule {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}
.svgBox {
  position: relative;
  display: flex;
  height: 50px;
  background-color: rgb(58, 56, 56);
}
/* 进度条 */
.svgBox .el-progress {
  margin: 10px 0px 0px 40px;
  width: 975px;
}
.svgBox .video_img {
  width: 40px;
  height: 40px;
  cursor: pointer;
  padding: 0 20px;
}
.svgBox .left {
  display: flex;
  align-items: center;
  border-right: 2px solid white;
}
.svgBox .uitil {
  background-color: rgba(0, 0, 0, 0.6);
  width: 80px;
  line-height: 40px;
  height: 40px;
  position: absolute;
  top: -40px;
  text-align: center;
  border-radius: 6px;
}
.svgBox .uitil .after {
  display: block;
  position: absolute;
  width: 0px;
  height: 0px;
  left: 32px;
  bottom: -16px;
  border-width: 8px;
  border-style: solid dashed dashed dashed;
  border-color: white transparent transparent transparent;
}
.navBarBox {
  position: absolute;
  top: 80px;
  left: 20px;
}
.navBarBox .el-menu {
  max-width: 200px;
}
.wuran::-webkit-scrollbar {
  width: 0px;
}
.navBarBox .wuran {
  box-sizing: border-box;
  height: 250px;
  overflow-y: auto;
}
.amap-demo {
  height: 100%;
  width: 100%;
}
</style>