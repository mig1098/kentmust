var app_select = (function(){
    "use strict";
    var view = ['default','myaccount','orders','ShoppingCart','one-page-checkout','ProductDetails'];
    var PRODUCT_YOUSAVE = 'product_yousave';
    var PRODUCT_LISTPRICE = 'product_listprice';
    var percent  = '%';
    var currency = '$';
    var CODE  = '';
    var sufix = '-ap';
    var d = document,url = d.URL,_path=location.pathname;
    var base_url = url.replace(/(.*?)\.com.*/,'$1.com/');
    var url_service='//apolomultimedia.us/kentuckymustang/service/prds';
    var arrayCodes=[];
    var arrNames=[];
    return {
        getData:function(callback){
            var str = arrayCodes.join(',');;
            var params = {codes:str};
            //return false;
            $.ajax({
                 type: 'GET',
                  url: url_service,
                  data:params,
                  async: true,
                  jsonpCallback: 'jsonp_callback2',
                  contentType: "application/json",
                  dataType: 'jsonp',
                  success: function(r) {
                    //console.log(r);
                    hideCart();
                    if(typeof callback == 'function'){
                        callback(r);
                    }
                    return false;
                  },
                  error: function(e) {
                    alert(e.message);
                  }
              });
        },
        getJson:function(_class,name,_pair){//POPULATE ARRAYS
        //console.log($(_class).text());
            var _json =  JSON.parse($(_class).text());
            //console.log(_json.data);
            //console.log(_pair);
            if(_pair == false){//single
                for(i in _json.data["Empty"]){
                    if(CODE == _json.data["Empty"][i][0]){
                        arrayCodes.push(_json.data["Empty"][i][1]);
                        arrNames.push({name:name,code:_json.data["Empty"][i][1],pair:false});
                    }
                }
            }else{//twice
                if(typeof _json.data[_pair] == 'undefined'){
                    return false;
                }
                for(i in _json.data[_pair]){
                    if(CODE == _json.data[_pair][i][0]){
                        arrayCodes.push(_json.data[_pair][i][1]);
                        arrNames.push({name:name,code:_json.data[_pair][i][1],pair:true});
                    }
                }
            }
        },
        selectObject:function(_select,_pair){
            arrayCodes =[];
            arrNames  = [];
            jQuery(_select).find('option').each(function(i,elm){
                if(i>0){
                    var name = jQuery(elm).text();
                    var _class = (function(text,sufix){
                        return '.'+text.replace(/\s/gm,'').replace('/','').replace('(','').replace(')','').replace(/(.*?)\s?\[.*\]/g,'$1')+sufix;
                    })(name,sufix);
                    //console.log(_class);
                    if($(_class).length > 0){
                        app_select.getJson(_class,name,_pair);
                    }
                }
            });
            if(arrayCodes.length > 0){
                app_select.getData(function(data){
                    for(var i=0;i< data.data.length;i++){
                        for(n in arrNames){
                            if(data.data[i].code == arrNames[n].code){
                                arrNames[n].price  = data.data[i].price;
                                arrNames[n].stock = data.data[i].stock||0;
                            }
                        }
                    }
                    //console.log(arrNames);
                    jQuery(_select).find('option').each(function(i,elm){
                        var value = jQuery(elm).text()
                        var t = jQuery(elm).text().replace(/(.*?)\$?[^\]]*\)/g,'$1');
                        //console.log(t);
                        for(n in arrNames){
                            if(arrNames[n].name == value){
                                var add = currency+parseFloat((arrNames[n].price)).toFixed(2)+' ('+arrNames[n].stock+' in stock)';
                                if(t.indexOf(add)<0){
                                    jQuery(elm).text(t+' '+add);
                                }
                            }
                        }
                    });
                    console.log('ok');
                });
            }
        },
        filterSelects:function(){
            var _selects = jQuery('select');
            //console.log(_selects.length); //size
            if(_selects.length == 1){
                app_select.selectObject(_selects[0],false);
            }else if(_selects.length == 2){
                jQuery(_selects[0]).change(function(){
                    var _pair = jQuery(this).find('option:selected').text();
                    app_select.selectObject(_selects[1],_pair);
                });
            }
        },
        filterUrl:function(){
            switch(true){
                case _path.indexOf(view[5]) > -1:
                    CODE = url.replace(/.*ProductCode=(.*?)/g,'$1');
                    app_select.filterSelects();
                break;
                default:
                    //console.log('other side');
                break;
            }
        },
        init:function(){
            this.filterUrl();
        }
    }
})();
window.onload = function() {
    app_select.init();
};   