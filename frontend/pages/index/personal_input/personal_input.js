const app = getApp()

Page({
    data: {
        nickname: "",
        user_avatar: "",
        event: [],
        realname: "",
        phonenumber: 0,
        memcount: 1,
        totalcost: 0,
        register_num: 0,
        user_id: 0,
        id: 0,
        pay_type: 1,
        btnstrarray: ["确认参加", "确认支付"],
        isfirstbtn: 0,
        isPayProcessing: false,
    },
    onLoad: function(param) {
        var that = this;
        that.setData({
            nickname: app.globalData.userInfo.nickname,
            user_avatar: app.globalData.userInfo.avatar
        })
        var id = param.id;
        this.setData({ btnstr: this.data.btnstrarray[1] })
        if (!app.globalData.userInfo.user_id) {
            wx.showModal({
                title: '获取用户信息失败',
                content: '由于无法获取您的信息，所以您无法使用参加活动等功能',
                showCancel: false,
                complete: function(res) {
                    wx.switchTab({
                        url: '../../activity/activity',
                        success: function() {
                            wx.showTabBar({})
                        }
                    })
                }
            })
            return;
        }
        that.data.user_id = app.globalData.userInfo.user_id;
        wx.request({
            url: app.globalData.mainURL + 'api/getEventDetail',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'event_id': id,
                'user_id': app.globalData.userInfo.user_id
            },
            success: function(res) {
                console.log(res)
                var bookInfo = res.data.booking;
                if (bookInfo.length > 0) {
                    for (var i = 0; i < bookInfo.length; i++) {
                        if (bookInfo[i].user_id == app.globalData.userInfo.user_id && bookInfo[i].state == '0') {
                            wx.navigateBack({ delta: 1 });
                            return;
                        }
                    }
                }

                var event_buf = res.data.result[0]
                var time = event_buf.start_time.split(':');
                event_buf.start_time = time[0] + ':' + time[1];
                time = event_buf.end_time.split(':');
                event_buf.end_time = time[0] + ':' + time[1];
                if (res.data.result[0].current_member == null)
                    that.data.register_num = 0
                else
                    that.data.register_num = res.data.result[0].current_member
                if (event_buf.start_time == undefined) {
                    event_buf.start_time = ""
                }
                if (event_buf.end_time == undefined) {
                    event_buf.end_time = ""
                }
                if (event_buf.province == "NaN" || event_buf.city == 'NaN' || event_buf.area == 'NaN' || event_buf.detail_address == 'NaN') {
                    event_buf.province = ''
                    event_buf.city = ' '
                    event_buf.area = ' '
                    event_buf.detail_address = ''
                }
                if (event_buf.agent_name == '')
                    console.log(event_buf)

                var realname = wx.getStorageSync('book_name');
                var phonenumber = wx.getStorageSync('book_phone');

                if (realname == '') realname = app.globalData.userInfo.name;
                if (phonenumber == '') phonenumber = app.globalData.userInfo.phone;
                var memcount = '1';

                that.setData({
                    event: event_buf,
                    id: id,
                    val_realname: realname,
                    realname: realname,
                    val_phonenumber: phonenumber,
                    phonenumber: phonenumber,
                    val_memcount: memcount,
                    memcount: memcount,
                });
                app.globalData.userInfo.honey = parseInt(app.globalData.userInfo.honey);
                app.globalData.userInfo.amount = parseFloat(app.globalData.userInfo.amount);

                that.prepare_payment(0, app.globalData.userInfo.honey, app.globalData.userInfo.amount, parseInt(event_buf.pay_type));


                var cost = 1 * that.data.event.cost
                if (cost == 0) {
                    that.data.total_cost = 0;
                } else {
                    that.data.total_cost = parseFloat(cost.toFixed(2));
                }
                that.setData({ total_cost: that.data.total_cost.toFixed(2) });
                that.calculate_pay_price();


                // that.prepare_payment(0, app.globalData.userInfo.honey, app.globalData.userInfo.amount, 1);
                // price, honey, wallet, pay_type(0-offline, 1-online pay)
            }
        })
    },
    on_Input_Realname: function(event) {
        this.setData({ realname: event.detail.value });
    },
    on_Input_Phonenumber: function(event) {
        this.setData({ phonenumber: event.detail.value });
    },
    on_Input_Memcount: function(event) {
        this.setData({ memcount: event.detail.value });
        var cost = (1 * event.detail.value) * (1 * this.data.event.cost)
        if (cost == 0) {
            this.data.total_cost = 0;
        } else {
            this.data.total_cost = parseFloat(cost.toFixed(2));
        }
        this.setData({ total_cost: this.data.total_cost });
        this.calculate_pay_price();
    },
    On_edit_comment: function(event) {
        this.data.comment = event.detail.value;
        this.setData({ comment: event.detail.value });
    },
    checkValidation: function() {
        var x = 0;
        var ret = false;
        if (this.data.realname.length == 0) {
            x++
            wx.showToast({
                title: '请填写真实姓名',
                icon: 'none'
            })
            return ret;
        }
        if (this.data.realname.length > 4) {
            x++
            wx.showToast({
                title: '姓名应不超过4个字',
                icon: 'none'
            })
            return ret;
        }
        if (this.data.phonenumber.length == 0) {
            x++
            wx.showToast({
                title: '请填写手机号码',
                icon: 'none'
            })
            return ret;
        }
        if (!app.checkValidPhone(this.data.phonenumber)) {
            x++
            wx.showToast({
                title: '请填写正确的手机号码',
                icon: 'none'
            })
            return ret;
        }
        if (this.data.memcount > (this.data.event.limit - this.data.register_num) ||
            this.data.memcount > this.data.event.person_limit) {
            x++
            wx.showToast({
                title: '总报名人数超过活动人数上限',
                icon: 'none'
            })
            return ret;
        }
        if (parseInt(this.data.memcount) <= 0) {
            x++
            wx.showToast({
                title: '请填写报名人数',
                icon: 'none'
            })
            return ret;
        }

        if (this.data.isfirstbtn == 1) {
            x++
            wx.showToast({
                title: '已支付了，请返回。',
                icon: 'none'
            })
            return ret;
        } else if (this.data.isfirstbtn == 0) {
            this.data.isfirstbtn = 1
        }
        ret = true;
        return ret;

    },
    on_click_payway: function(e) {
        var x = 1 * e.detail.value
        this.setData({ btnstr: this.data.btnstrarray[x] })
        this.data.pay_type = e.detail.value
        this.setData({
            pay_type: this.data.pay_type
        })
        this.calculate_pay_price();
    },

    ///////////////////////// pay_template processor //////////////////////////////////
    prepare_payment: function(price, honey, wallet, pay_type) {

        if (price == undefined) price = 0; // total price for pay needed
        if (honey == undefined) honey = 0; // user's honey
        if (wallet == undefined) wallet = 0; // user's wallet
        if (pay_type == undefined) pay_type = 0; // 0-offline paymeng, 1-online payment

        if (pay_type == 2) pay_type = 1;

        var that = this;
        that.data.price = price;

        that.data.phone = '';
        that.data.comment = '';
        that.data.name = '';
        that.data.old_wallet = wallet;
        that.data.mem_count_img = [
            '../../../image/minus@2x.png', '../../../image/minus_hover@2x.png',
            '../../../image/plus@2x.png', '../../../image/plus_hover@2x.png'
        ];

        var honey_unit = 10000;
        var honey_list = [];
        var honey_rule = parseInt(app.globalData.rule[12].value);
        var honey_price_rule = honey_unit / honey_rule * parseFloat(app.globalData.rule[13].value);

        if (honey_rule > honey) honey_rule = honey;
        for (var i = honey_unit; i <= honey_rule; i += honey_unit) {
            honey_list.push(i);
        }

        if (app.globalData.userInfo.isVIP != 1) {
            honey_unit = 0; //parseInt(app.globalData.rule[10].value);
            honey_price_rule = 0; //parseFloat(app.globalData.rule[11].value);
            honey_list = [];
        }

        that.setData({
            total_cost: price,
            pay_price: price,
            honey_list: honey_list,
            honey_id: 0,
            wallet: wallet * 1,

            pay_type: pay_type, //0-offline, 1-online payment
            book_id: that.data.event.id, // record id for booking
            book_type: 0, // 0-activity booking, 1-event booking, 2-room booking

            select_honey: 0,
            chk_imgs: ["../../../image/hook_n@2x.png", "../../../image/hook_s.png"],
            check_honey: 0,
            check_wallet: 0,
            honey_price_unit: honey_price_rule,


            min_img: that.data.mem_count_img[0],
            plus_img: that.data.mem_count_img[2],

        });

        this.calculate_pay_price();
    },
    change_mem_count: function(event) {
        var that = this;
        var memcount = parseInt(that.data.memcount);

        console.log(memcount);
        var btnType = event.currentTarget.dataset.type;
        var user = app.globalData.userInfo;
        switch (btnType) {
            case 'plus':
                memcount++;
                if (memcount > (that.data.event.limit - that.data.register_num) ||
                    memcount > that.data.event.person_limit) {
                    if (that.data.person_limit > that.data.event.limit - that.data.register_num)
                        memcount = (that.data.event.limit - that.data.register_num);
                    else
                        memcount = that.data.event.person_limit;

                }
                that.setData({
                    min_img: that.data.mem_count_img[0],
                    plus_img: that.data.mem_count_img[3],
                })
                break;
            case 'minus':
                memcount--;
                if (memcount < 0) memcount = 0;
                that.setData({
                    min_img: that.data.mem_count_img[1],
                    plus_img: that.data.mem_count_img[2],
                })
                break;
        }
        var cost = (1 * memcount) * (1 * this.data.event.cost)
        if (cost == 0) {
            this.setData({ total_cost: 0 })
        } else {
            this.setData({ total_cost: cost.toFixed(2) })
        }
        that.data.memcount = memcount;
        that.setData({
            val_memcount: that.data.memcount,
        })
        that.calculate_pay_price();
    },
    show_select_honey: function(event) {
        var that = this;
        if (that.data.check_honey == 1)
            that.setData({
                select_honey: 1
            })
    },
    select_honey_price: function(event) {
        var that = this;
        var idx = parseInt(event.currentTarget.dataset.id);
        that.setData({
            select_honey: 0,
            honey_id: idx,
        })
        that.calculate_pay_price();
    },
    payment_check: function(event) {
        var that = this;
        var type = event.currentTarget.dataset.type;
        switch (type) {
            case 'honey':
                that.data.check_honey = 1 - that.data.check_honey;
                break;
            case 'wallet':
                that.data.check_wallet = 1 - that.data.check_wallet;
                break;
        }
        that.calculate_pay_price();
        if (type == 'honey' && that.data.check_honey == 0.0) {
            wx.showToast({
                title: '当总价大于蜂蜜价时，可以使用蜂蜜!',
                icon: 'none',
                duration: 2000
            });
        }
    },
    calculate_pay_price: function() {
        var that = this;
        that.data.price = that.data.total_cost * 1;

        that.data.pay_price = that.data.price;
        that.data.wallet = that.data.old_wallet;
        if (that.data.check_honey == 1 && that.data.pay_price * 1 >= (that.data.honey_id * 1 + 1) * that.data.honey_price_unit)
            that.data.pay_price = that.data.pay_price - (that.data.honey_id * 1 + 1) * that.data.honey_price_unit;
        else if (that.data.honey_id == 0)
            that.data.check_honey = 0;

        if (that.data.check_wallet == 1) {
            if (that.data.pay_price * 1 >= that.data.wallet * 1) {
                that.data.pay_price = that.data.pay_price - that.data.wallet;
                that.data.wallet = 0;
            } else {
                that.data.wallet -= that.data.pay_price;
                that.data.pay_price = 0;
            }
        }

        that.data.check_honey = parseFloat(that.data.check_honey.toFixed(2))
        that.data.check_wallet = parseFloat(that.data.check_wallet.toFixed(2))
        that.data.pay_price = parseFloat(that.data.pay_price.toFixed(2))
        that.data.wallet = parseFloat(that.data.wallet.toFixed(2))

        that.setData({
            check_honey: that.data.check_honey,
            check_wallet: that.data.check_wallet,
            pay_price: that.data.pay_price,
            wallet: that.data.wallet
        });
        that.data.isPayProcessing = false;
    },
    perform_pay: function(event) {
        var that = this;


        if (that.checkValidation() == false) return;

        if (that.data.isPayProcessing) return;
        that.data.isPayProcessing = true;

        var type = that.data.pay_type;
        var item_id = that.data.book_id;
        var book_mode = that.data.book_type;
        if (that.data.pay_type == 1 && that.data.pay_price != 0) {
            console.log(that.data.pay_price)
            var ordercode = that.data.pay_price;
            var out_trade_no = app.globalData.mch_id + Date.now() + (10000 + Math.floor(Math.random() * 90000))
            console.log(ordercode)
            wx.login({
                success: function(res) {
                    if (res.code) {
                        wx.request({
                            url: app.globalData.mainURL + 'api/pay',
                            data: {
                                id: wx.getStorageSync('openid'), //要去换取openid的登录凭证
                                fee: ordercode,
                                user_id: app.globalData.userInfo.user_id,
                                out_trade_no: out_trade_no
                            },
                            method: 'POST',
                            header: {
                                'content-type': 'application/json'
                            },
                            success: function(res) {
                                wx.requestPayment({
                                    timeStamp: res.data.timeStamp,
                                    nonceStr: res.data.nonceStr,
                                    package: res.data.package,
                                    signType: 'MD5',
                                    paySign: res.data.paySign,
                                    success: function(res) {
                                        if (res.errMsg.length <= 20) {
                                            that.data.out_trade_no = out_trade_no;
                                            that.add_booking();
                                        }
                                    },
                                    fail: function(res) {
                                        // fail
                                        that.data.isPayProcessing = false;
                                    },
                                    complete: function(res) {
                                        that.data.isfirstbtn = 0
                                    }
                                })
                            }
                        })
                    } else {
                        // no weixin returned code
                    }
                }
            });
        } else if (that.data.price != 0) {
            // offline payment
            that.data.out_trade_no = '';
            that.data.pay_price = 0;
            that.add_booking();
        } else {
            that.data.out_trade_no = '';
            that.data.pay_price = 0;
            that.data.pay_honey = 0;
            that.data.pay_online = 0;
            that.data.pay_type = 0;
            that.data.check_honey = 0;
            that.add_booking();
        }
    },

    add_booking: function() {
        var that = this;
        wx.request({
            url: app.globalData.mainURL + 'api/addBooking',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                user_id: that.data.user_id,
                event_id: that.data.book_id,
                reg_num: that.data.memcount,
                pay_type: that.data.pay_type,
                role: app.globalData.userInfo.role,
                out_trade_no: that.data.out_trade_no,
                phone: that.data.phonenumber,
                val_opt: '',
                name: that.data.realname,

                wallet: that.data.wallet,
                pay_cost: that.data.price,
                pay_online: that.data.pay_price,
                pay_honey: ((that.data.check_honey == 1) ? (that.data.honey_id * 1 + 1) * that.data.honey_price_unit : 0),
                description: that.data.comment
            },
            success: function(res) {
                that.data.isPayProcessing = false;
                that.data.isfirstbtn = 0;
                wx.redirectTo({
                    url: '../../profile/final_cancel/final_cancel?type=2&event=' + that.data.book_id,
                    success: function() {
                        that.data.isfirstbtn = 0
                    }
                })
            }
        })
    },

    ////////////////////////////////////////////////////////////////////////

})