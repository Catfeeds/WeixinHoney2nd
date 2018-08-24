const app = getApp()
var amapFile = require('../../lib/amap-wx.js')
require('../../utils/global.js')

var myAmap = new amapFile.AMapWX({ key: "F8f1f5c8a20c199dd0f70f5a6b162280" })
var mapCtx
Page({
  data: {
    rooturl: "../../",
    uploadUrl: app.globalData.uploadURL,
    event_type: app.globalData.eventType,
    view_type: 0,
    select_kind: 0,    
    select_able_type: "../../image/mapview_icon.png",
    current_latitude: 0,
    current_longitude: 0,
    filter_places: [],
    circles: [],

    // template_table variables    
    favorite_pictures: [
      "../../image/favoriting.png",
      "../../image/favorited.png"],
    starparam: {
      stars: [0, 1, 2, 3, 4],
      srcImage_0: "../../image/star-0.png",
      srcImage_1: "../../image/star-1.png",
      srcImage_2: "../../image/star-2.png",
      srcImage_3: "../../image/star-3.png",
      srcImage_4: "../../image/star-4.png",
      score: 4.3,
      srcImage: ""
    },
    select_menu_state: 0,
    select_order_menu_state: 0,
    select_filter_menu_state: 0,
    select_style_menu_state: 0,
    color_array:[
      "#000000",
      "#e6b53c"
    ],
    menu_btn_array:[
      "../../image/btn_updown@2x.png",
      "../../image/btn_updown_hover@2x.png"
    ],
    menu_order_index: 0,
    menu_filter_index: 1,
    menu_style_index: 0,
    prev_menu_style_index: 0,
    menu_order_array:[
      "离我最近",
      "评分最高",
      "智能排序",
    ],
    menu_filter_array: [],  
    item_array: [
      { id: 0, src: "../../image/move00@2x.png" },
      { id: 1, src: "../../image/move01@2x.png" },
      { id: 2, src: "../../image/move02@2x.png" },
      { id: 3, src: "../../image/move03@2x.png" },
      { id: 4, src: "../../image/move04@2x.png" },
      { id: 5, src: "../../image/move05@2x.png" },
      { id: 6, src: "../../image/move06@2x.png" },
      { id: 7, src: "../../image/move07@2x.png" },
      { id: 8, src: "../../image/move08@2x.png" },
      { id: 9, src: "../../image/move09@2x.png" },
      { id: 10, src: "../../image/move10@2x.png" },
      { id: 11, src: "../../image/move11@2x.png" },
      { id: 12, src: "../../image/move12@2x.png" },
      { id: 13, src: "../../image/move13@2x.png" },
      { id: 14, src: "../../image/move14@2x.png" },
      { id: 15, src: "../../image/move15@2x.png" },
      { id: 16, src: "../../image/move16@2x.png" },
      { id: 17, src: "../../image/move17@2x.png" },
      { id: 18, src: "../../image/move18@2x.png" },
      { id: 19, src: "../../image/move19@2x.png" },
      { id: 20, src: "../../image/move20@2x.png" },
      { id: 21, src: "../../image/move21@2x.png" },
      { id: 22, src: "../../image/move22@2x.png" },
      { id: 23, src: "../../image/move23@2x.png" },
      { id: 24, src: "../../image/move24@2x.png" },
      { id: 25, src: "../../image/move25@2x.png" },
      { id: 26, src: "../../image/move26@2x.png" },
      { id: 27, src: "../../image/move27@2x.png" },
      { id: 28, src: "../../image/move28@2x.png" },
      { id: 29, src: "../../image/move29@2x.png" },
      { id: 30, src: "../../image/move30@2x.png" },
      { id: 31, src: "../../image/move31@2x.png" },
      { id: 32, src: "../../image/move32@2x.png" },
      { id: 33, src: "../../image/move33@2x.png" }],
    show_array: [
      { id: 0, src: "../../image/move00@2x.png" },
      { id: 1, src: "../../image/move01@2x.png" },
      { id: 2, src: "../../image/move02@2x.png" },
      { id: 3, src: "../../image/move03@2x.png" },
      { id: 4, src: "../../image/move04@2x.png" },
      { id: 5, src: "../../image/move05@2x.png" },
      { id: 6, src: "../../image/move06@2x.png" },
      { id: 7, src: "../../image/move07@2x.png" },
      { id: 8, src: "../../image/move08@2x.png" }],
    uppoint: 0,
    downpoint: 8,
    currentkind: "../../image/move00@2x.png",
    marker: [],
    site_array: [],
    newscount: 0,
    events: [],
    currentid: 0,
    num: 0,
    flag: 100,
    file_paths: []
  },
  onLoad: function (option) {
    mapCtx = wx.createMapContext('mymap')    
    
  },
  onShow: function (option) {
    //get system templates.
    wx.request({
      url: app.globalData.mainURL + 'api/getTemplates',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        app.globalData.template = res.data.template
        console.log(app.globalData.template)
      },
    })
    this.data.num = 0
    wx.showTabBar({
    })
    if (app.globalData.userInfo.forbidden == 1) {
      wx.showModal({
        title: '您的账号已被禁用',
        showCancel: false,
        complete: function () {
          wx.navigateBackMiniProgram({
          })

        }
      })
    }
    wx.setNavigationBarTitle({
      title: '蜂去吧'
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#e6b53c'
    })
    var that = this
    that.data.show_array = [
      { id: 0, src: "../../image/move00@2x.png" },
      { id: 1, src: "../../image/move01@2x.png" },
      { id: 2, src: "../../image/move02@2x.png" },
      { id: 3, src: "../../image/move03@2x.png" },
      { id: 4, src: "../../image/move04@2x.png" },
      { id: 5, src: "../../image/move05@2x.png" },
      { id: 6, src: "../../image/move06@2x.png" },
      { id: 7, src: "../../image/move07@2x.png" },
      { id: 8, src: "../../image/move08@2x.png" }]
    that.data.select_kind = 0
    that.data.uppoint = 0
    that.data.downpoint = 8
    that.data.currentkind = "../../image/move00@2x.png"
    that.data.marker = []
    that.data.circles = []
    that.data.newscount = 0
    that.data.events = []
    that.data.currentid = 0

    that.setData({
      show_array: that.data.show_array,
      currentkind: that.data.currentkind,
      currentid: 0,
      select_kind: that.data.select_kind,
      rooturl:that.data.rooturl
    })

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        if (app.globalData.issearch == 0) {
          that.data.current_latitude = res.latitude
          that.data.current_longitude = res.longitude
        }
        else {
          that.data.current_latitude = app.globalData.searchlat
          that.data.current_longitude = app.globalData.searchlong
          app.globalData.issearch = 0
        }
        that.data.circles[0] = {
          latitude: that.data.current_latitude,
          longitude: that.data.current_longitude,
          color: "#e6b53c",
          fillcolor: "#e6b53c80",
          radius: 1000,
          strokeWidth: 2
        };

        
        that.setData({ current_latitude: that.data.current_latitude, current_longitude: that.data.current_longitude, circles: that.data.circles})
        setTimeout(function () {
          wx.request({
            url: app.globalData.mainURL + 'api/getItemsOnMap',
            data: {
              latitude: that.data.current_latitude,
              longitude: that.data.current_longitude,
              user_id: app.globalData.userInfo.user_id
            },
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              if (!res.data.status) return;
              wx.getSystemInfo({
                success: function (res2) {
                  var brandx = 0
                  var brandy = 0
                  if (res2.brand == 'iPhone') {
                    brandx = -50
                    brandy = 20
                  }
                  var iter
                  for (iter = 0; iter < res.data.honey.length; iter++) {
                    var str = res.data.honey[iter].amount + "ml"
                    var id = "h" + res.data.honey[iter].no
                    that.data.marker[iter] = {
                      iconPath: "../../image/honey.png",
                      id: id,
                      latitude: 1 * (res.data.honey[iter].latitude),
                      longitude: 1 * (res.data.honey[iter].longitude),
                      width: (100 / 750) * res2.screenWidth,
                      height: (50 / 1344) * res2.screenHeight,
                      anchor: { x: 0, y: 1 },
                      kind: "honey",
                      label: {
                        content: str,
                        color: "#000000",
                        fontSize: (20 / 750) * res2.screenWidth,
                        bgColor: "#e6b53c",
                        padding: (3 / 750) * res2.screenWidth,
                        borderWidth: (1 / 750) * res2.screenWidth,
                        borderColor: "#000000",
                        borderRadius: (3 / 750) * res2.screenWidth,
                        x: ((35 + brandx) / 750) * res2.screenWidth,
                        y: ((-36 + brandy) / 1344) * res2.screenHeight
                      }
                    }
                  }
                  if (iter == res.data.honey.length) {
                    wx.getSavedFileList({
                      success: function (res) {
                        if (res.fileList.length > 0) {
                          wx.removeSavedFile({
                            filePath: res.fileList[0].filePath,
                            complete: function (res) {
                              console.log(res)
                            }
                          })
                        }
                      }
                    })
                    var sites = res.data.site
                    that.data.site_array = [];
                    iter = 0
                    that.data.menu_filter_array = [
                      {
                        areaId: "000000",
                        areaName: "附近3km"
                      },
                      {
                        areaId: "000000",
                        areaName: "附近5km"
                      }
                    ];
                    for (var i = 0; i < sites.length; i++) {
                      that.data.site_array.push(sites[i])
                      that.data.marker.push({
                        iconPath: "/image/" + (1 * sites[i].site_type + 1) + ".png",
                        id: "o" + sites[i].boss_id,
                        latitude: 1 * sites[i].latitude,
                        longitude: 1 * sites[i].longitude,
                        width: .092 * res2.screenWidth,
                        height: 73 / 1344 * res2.screenHeight,
                        kind: "site"
                      });
                      console.log("-----" + that.data.menu_filter_array._find(item => item.areaId == sites[i].areaId));
                      if (!that.data.menu_filter_array._find(item => item.areaId == sites[i].areaId)) {
                        that.data.menu_filter_array.push({
                          areaId: sites[i].areaId,
                          areaName: sites[i].areaName
                        });
                      }                      
                    }
                    that.setData({
                      menu_filter_array: that.data.menu_filter_array,
                    });                    
                    that.all_filter_item();
                    that.show_marker();
                  }
                },
              })
            },
          })
        }, 2000)
      },
      fail(error) {
      }
    })
    var that = this
    /*
    if (app.globalData.see_news == 1) {
      app.globalData.see_news == 0
      that.setData({ newscount: 0 })
      return;
    }
    */
    wx.request({
      url: app.globalData.mainURL + 'api/getNewAlarm',
      data: {
        user_id: app.globalData.userInfo.user_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (!res.data.status) return;
        that.setData({ newscount: res.data.news[0].amount * 1 })
      },
    })
  },
  sleep: function (milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds) {
        break;
      }
    }

  },
  download_honey: function (res, res2, iter, brandx, brandy) {
    setTimeout(function () {
      console.log(iter)
    }, 1000)

  },
  download_icon: function (map_icon, index, sites) {
    var iter = index
    var that = this
    wx.getSystemInfo({
      success: function (res2) {
        wx.downloadFile({
          url: app.globalData.uploadURL + map_icon,
          success: function (res1) {
            var temppath = res1.tempFilePath
            wx.saveFile({
              tempFilePath: temppath,
              success: function (res) {
                that.data.marker.push({
                  iconPath: res.savedFilePath,
                  id: 'o' + sites[iter].boss_id,
                  latitude: 1 * sites[iter].latitude,
                  longitude: 1 * sites[iter].longitude,
                  width: (69 / 750) * res2.screenWidth,
                  height: (73 / 1344) * res2.screenHeight,
                  kind: "site",
                })

                if (app.globalData.map_idx == sites.length - 1) {
                  that.show_marker()
                }
                app.globalData.map_idx++
              }
            })
          }
        })
      }
    })
  },
  show_marker: function (kind = 0, first = 1) {
    wx.hideLoading()
    var tempmarker = new Array()
    if (kind == 0) {
      this.setData({ markers: this.data.marker})
    }
    else {
      for (var iter = 0; iter < this.data.marker.length; iter++) {
        if (this.data.marker[iter].kind == "honey") {
          tempmarker.push(this.data.marker[iter])
        }
        else if (this.data.marker[iter].kind == "site") {
          if (kind == 0) {
            tempmarker.push(this.data.marker[iter]);
            continue
          }
          var split_array = this.data.marker[iter].iconPath.split("/");
          var index = split_array[split_array.length - 1].split(".")[0];
          if (kind == index) {
            tempmarker.push(this.data.marker[iter]);
            continue;
          }
          // for (var jter = 0; jter < this.data.events.length; jter++) {
          //   if (kind != 0 && this.data.events[jter].type * 1 == kind - 1 && 'o' + this.data.events[jter].no == this.data.marker[iter].id && this.data.events[jter].state == 0) {
          //     tempmarker.push(this.data.marker[iter])
          //     break;
          //   }
          // }
        }
      }
      console.log(tempmarker)
      this.setData({ markers: tempmarker})
    }
  },
  //marker function
  on_Click_maker: function (event) {
    if (event.markerId[0] == "h") {
      var vip = app.globalData.userInfo.isVIP + 1
      for (var iter = 0; iter < this.data.marker.length; iter++) {
        if (this.data.marker[iter].id == event.markerId) {
          break;
        }
      }
      var origin = [this.data.marker[iter]] //selected honey

      var str = origin[0].label.content
      str = 1 * str.slice(0, str.length - 2) //current honey amount
      var distancex = this.distance(origin[0].latitude, origin[0].longitude, this.data.current_latitude, this.data.current_longitude)
      var flag = 0
      var clickhoney = 0
      if (wx.getStorageSync('user_step') == '') wx.setStorageSync('user_step', '0')
      var step = parseInt(wx.getStorageSync('user_step'))
      var markersin = (step / 2 * vip)
      console.log('------markersin =  ------' + markersin);
      if (app.globalData.daily_honey == '') {
        app.globalData.daily_honey = [0, 0]
      }
      if (distancex < markersin) { //less than markersin
        var rand = 1 + Math.ceil(Math.random() * (app.globalData.rule[5].value * 1 - app.globalData.daily_honey[0]) - 1)         //daily honey getting from map is less than 500
        var rand1 = Math.ceil(parseInt(str) * (0.1 + Math.random() * 0.4));
        if (rand1 < rand) rand = rand1;
        if (rand < 3) {
          flag = 1
          clickhoney = str
        }
        else {
          str -= rand
          clickhoney = rand
        }
      }
      else {
        wx.showToast({
          title: '距离不够，无法采集',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (app.globalData.daily_honey[0] >= app.globalData.rule[5].value) {
        wx.showToast({
          title: '您今天已经收获了' + app.globalData.rule[5].value + 'ml蜂蜜，明天再来哦',
          icon: 'none',
          duration: 1000
        })
        return;
      }
      if (app.globalData.isactivetime == 0) {
        wx.showToast({
          title: '从早上7点开始可以收集蜂蜜',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      var todayarray = wx.getStorageSync("todayselected")
      for (var iter = 0; iter < todayarray.length; iter++) {
        if (todayarray[iter] == event.markerId) {
          wx.showToast({
            title: '您已经采集过了',
            icon: 'none',
            duration: 2000
          })
          return;
        }
      }

      var honey_info = wx.getStorageSync('honey_info');
      app.globalData.daily_honey[0] += clickhoney;
      honey_info.total_honey = honey_info.total_honey * 1 + clickhoney;
      var total_honey = honey_info.total_honey;
      wx.setStorageSync('honey_info', honey_info)
      todayarray.push(event.markerId)
      wx.setStorageSync("todayselected", todayarray)
      wx.setStorageSync("daily_honey", app.globalData.daily_honey)
      var markernumber = event.markerId.slice(1, event.markerId.length)
      app.globalData.honey_info = honey_info
      console.log(clickhoney)
      var title = '成功收取' + clickhoney + 'ml蜂蜜'
      wx.showToast({
        title: title,
        duration: 2000,
        icon: 'none'
      })
      wx.request({
        url: app.globalData.mainURL + 'api/catchHoney',
        method: 'POST',
        header: {
          'content-type': "application/json"
        },
        data: {
          amount: total_honey,
          no: markernumber,
          user_id: app.globalData.userInfo.user_id,
          honey: clickhoney
        },
        success: function (res) {

        }
      })

      if (flag == 0) {
        origin[0].label.content = str + "ml"
        this.data.marker.push(origin[0])
      }
      this.setData({ markers: this.data.marker })
    }
    else if (event.markerId[0] == "o") {
      var markernumber = event.markerId.slice(1, event.markerId.length)
      wx.navigateTo({
        url: 'detail_gym/detail_gym?id=' + markernumber,
      })
    }
    else { }
  },
  distance: function (lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 + c(lat1 * p) * c(lat2 * p) *
      (1 - c((lon2 - lon1) * p)) / 2
    return 12742000 * Math.asin(Math.sqrt(a)) // 2 * R; R = 6371 km
  },
  //sidebar functions
  on_click_down: function (event) {
    if (this.data.downpoint < 33) {
      this.data.show_array.shift()
      this.data.downpoint++;
      this.data.uppoint++
      this.data.show_array.push(this.data.item_array[this.data.downpoint])
      this.setData({ show_array: this.data.show_array })
    }
  },
  on_click_up: function (event) {
    if (this.data.uppoint > 0) {
      this.data.show_array.pop()
      this.data.downpoint--;
      this.data.uppoint--
      this.data.show_array.unshift(this.data.item_array[this.data.uppoint])
      this.setData({ show_array: this.data.show_array })
    }
  },
  on_selectkind: function (event) {
    this.setData({
      currentkind: this.data.item_array[event.currentTarget.id].src,
      select_kind: 0,
      currentid: event.currentTarget.id * 1
    })
    this.show_marker(event.currentTarget.id * 1, 0)
  },

  on_click_select_menu: function () {
    this.setData({ select_kind: 1 })
  },
  //searchbox function
  on_click_search: function () {
    wx.navigateTo({
      url: 'search/search',
    })
  },

  on_click_viewstyle: function () {
    var that = this;
    if (that.data.view_type == 0) {
      that.setData({
        view_type: 1,
        select_able_type: "../../image/tableview_icon.png",        
      });
    } else {      
      that.setData({
        view_type: 0,        
        select_able_type: "../../image/mapview_icon.png",        
      });
      this.all_filter_item;
    }
  },
  on_click_create_event: function () {
    wx.request({
      url: app.globalData.mainURL + 'api/getUserState',
      method: 'post',
      data: {
        'nickname': app.globalData.userInfo.nickname
      },
      success: function (res) {
        app.globalData.userInfo.state = res.data.result[0].state
        if (app.globalData.userInfo.state == 0) {
          wx.showModal({
            title: '提示',
            content: '请先进行身份认证',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../profile/auth/auth',
                })
              } else if (res.cancel) {
              }
            }
          })
          return;
        }
        if (app.globalData.userInfo.state == 3) {
          wx.showModal({
            title: '提示',
            content: '您的身份认证审核未通过，请重新提交',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../profile/auth/auth',
                })
              } else if (res.cancel) {
              }
            }
          })
          return;
        }
        if (app.globalData.userInfo.state == 1) {
          wx.showModal({
            title: '提示',
            content: '您的认证资料已提交，请等待审核通过',
            showCancel: false,
          })
          return;
        }
        wx.navigateTo({
          url: '../other/create_event/create_event',
        })
      }
    })

  },
  on_click_news: function () {
    wx.navigateTo({
      url: 'news/news'
    })
  },
  preventTouchMove: function () {
    console.log("Ok")
  },

  // template_table functions
  click_detail_place: function (event) {
    wx.navigateTo({
      url: 'detail_gym/detail_gym?id=' + event.currentTarget.id,
    })
  },
  on_click_ordermenu: function () {
    this.setData({
      select_menu_state: 1,
      select_order_menu_state: 1,
      select_filter_menu_state: 0,
      select_style_menu_state: 0,
    })

  },
  on_click_filtermenu: function () {
    this.setData({
      select_menu_state: 1,
      select_order_menu_state: 0,
      select_filter_menu_state: 1,
      select_style_menu_state: 0,

    })
  },
  on_click_stylemenu: function () {
    var that = this;
    that.setData({
      prev_menu_style_index: that.data.menu_style_index,
      select_menu_state: 1,
      select_order_menu_state: 0,
      select_filter_menu_state: 0,
      select_style_menu_state: 1,
    })
  },

  compare_distance: function (a,b) {
    if (a.distance < b.distance)
      return -1;
    if (a.distance > b.distance)
      return 1;
    return 0;
  },
  compare_score: function (a,b) {
    if (a.point > b.point)
      return -1;
    if (a.point < b.point)
      return 1;
    return 0;
  },
  compare_favorite: function (a,b) {
    if (a.isfavourite > b.isfavourite)
      return -1;
    if (a.isfavourite < b.isfavourite)
      return 1;
    return 0;
  },
  

  //filter functions
  all_filter_item: function(){
    var that = this;
    var order_index = that.data.menu_order_index;
    var filter_index = that.data.menu_filter_index;
    var style_index = that.data.menu_style_index;

    //get filter array
    var filter_array = [];
    if (filter_index == 0) {      
      // search by nearest 3km from me 
      filter_array = that.data.site_array.filter(item =>item.distance < 3.0);           
    } else if (filter_index == 1) {
      // search by nearest 5km from me 
      filter_array = that.data.site_array.filter(item =>1.0*item.distance < 5.0);      
    } else {
      // search specific areas
      filter_array = that.data.site_array.filter(item =>item.areaId==that.data.menu_filter_array[filter_index].areaId);     
    }

    //get style arrays
    var style_array = [];
    if (style_index == 33) {
      style_array = filter_array;
    } else {
      style_array = filter_array.filter(item =>item.site_type==style_index);
    }


    //get order arrays
    if (order_index == 0) {
      // search by nearest from me
      that.setData({
        filter_places: style_array.sort(that.compare_distance)
      });      
    } else if (order_index == 1) {
      //search by highest score 
      that.setData({
        filter_places: style_array.sort(that.compare_score)
      });
       
    } else {         
      //sorted by distance
      var sort_distance_array = style_array.sort(that.compare_distance);
      //已关注 first, 未关注 second
      that.setData({
        filter_places: sort_distance_array.sort(that.compare_favorite)
      });
    }
  },
  clicked_order_item: function (event) {
    var that = this;    
    this.setData({
      select_menu_state: 0,
      select_order_menu_state: 0,
      select_filter_menu_state: 0,
      select_style_menu_state: 0,
      menu_order_index:event.currentTarget.id
    });
    that.all_filter_item();   
  },
  clicked_filter_item: function (event) {
    var that = this;    
    that.setData({
      select_menu_state: 0,
      select_order_menu_state: 0,
      select_filter_menu_state: 0,
      select_style_menu_state: 0,
      menu_filter_index:event.currentTarget.id
    }); 
    that.all_filter_item(); 
  },
  clicked_style_item: function (event) {
    this.setData({
      menu_style_index:event.currentTarget.id
    })
  },
  clicked_style_all: function (event) {
    this.setData({
      menu_style_index:33
    })
  },
  cancel_btn_clicked: function () {
    var that = this;
    this.setData({
      menu_style_index: that.data.prev_menu_style_index,
      select_menu_state: 0,
      select_order_menu_state: 0,
      select_filter_menu_state: 0,
      select_style_menu_state: 0,
    })
  }, 
  ok_btn_clicked: function () {
    this.setData({
      select_menu_state: 0,
      select_order_menu_state: 0,
      select_filter_menu_state: 0,
      select_style_menu_state: 0,
    });
    this.all_filter_item(); 
  }
})




//filter and find array
Array.prototype.filter = function (fun /* , thisArg*/) {
  "use strict";

  if (this === void 0 || this === null)
    throw new TypeError();

  var t = Object(this);
  var len = t.length >>> 0;
  if (typeof fun !== "function")
    throw new TypeError();

  var res = [];
  var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
  for (var i = 0; i < len; i++) {
    if (i in t) {
      var val = t[i];

      // NOTE: Technically this should Object.defineProperty at
      //       the next index, as push can be affected by
      //       properties on Object.prototype and Array.prototype.
      //       But that method's new, and collisions should be
      //       rare, so use the more-compatible alternative.
      if (fun.call(thisArg, val, i, t))
        res.push(val);
    }
  }

  return res;
};
Array.prototype._find = function (fn) {
  if (this === null) throw new TypeError('this is null or not defined');

  let that = Object(this), len = that.length >>> 0;

  if (typeof fn !== 'function') throw new TypeError('fn is not function');

  for (let i = 0; i < len; i++) {
    if (fn(that[i])) return that[i];
  }
  return undefined;
}

Array.prototype._filter = function(fn){
	if(this === null) throw new TypeError('this is null or not defined'); 
	
	let that = Object(this);
	
	if(typeof fn !== 'function') throw new TypeError('fn is not function');
	
	let new_arr = [];
	
	for(let i = 0;i < that.length>>>0;i++){
		fn(that[i]) && new_arr.push(that[i]);
	}
	
	return new_arr;
}