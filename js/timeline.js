var dateString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear()+543;
today = dd + '/' + mm + '/' + yyyy;
var cleararray = "";
var EidRedeemPoint = "";
var sTotalPointRedeem = 0;
var sTotalItemRedeem = 0;
var PointForRedeem = 0;
var sStockName = "";
var sStockImg = "";
var sStockImg = "";
var sStockDetail = "";
var xProduct = "BALife";


$(document).ready(function () {
  if(sessionStorage.getItem("EmpID_Newyear")==null) { location.href = "index.html"; }
  Connect_DB();
  dbPRUstock = firebase.firestore().collection("PRUstock");
  dbPRUredeemPoint = firebase.firestore().collection("PRUredeempoint");
  dbSellerCampaign = firebase.firestore().collection("SellerCampaign");
  dbPRUstocklog = firebase.firestore().collection("PRUstock_log");
  //dbStockConfirm = firebase.firestore().collection("PRUstockconfirm");
  dbStockConfirm = firebase.firestore().collection("PRUstockconfirm");

  ClickMenu(1);
  CheckRedeemPoint();
  DisplayPoint();
  //LoadReward();
  //CheckDate();
});



function CheckRedeemPoint() {
  //dbPRUstocklog.where('EmpID','==',parseFloat(sessionStorage.getItem("EmpID_PRU")))
  dbPRUredeemPoint.where('EmpID','==',parseFloat(sessionStorage.getItem("EmpID_PRU")))
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      EidRedeemPoint = doc.id;
      sTotalPointRedeem = doc.data().TotalPointRedeem;
      sTotalItemRedeem = doc.data().TotalItemRedeem;
      sessionStorage.setItem("TotalPointRedeem", doc.data().TotalPointRedeem);
      sessionStorage.setItem("TotalItemRedeem", doc.data().TotalItemRedeem);
    });
    //alert(EidRedeemPoint+"==="+sTotalPointRedeem);
  });
}

function ClickMenu(x) {
  if(x==1) {
    $('#mm1').addClass('btnCheck');
    $('#mm2').removeClass('btnCheck');
    $('#mm3').removeClass('btnCheck');
    document.getElementById("JumpMenu").style.display = "block";
    document.getElementById("loading1").style.display = "block";
    document.getElementById("loading2").style.display = "none";
    document.getElementById("loading3").style.display = "none";
    document.getElementById("DisplayShowRewards").style.display = "none";
    document.getElementById("DisplayRedeemRewards").style.display = "none";
    document.getElementById("DisplayDoneRewards").style.display = "none";
    LoadReward();
  } else if(x==2) { 
    $('#mm1').removeClass('btnCheck');
    $('#mm2').addClass('btnCheck');
    $('#mm3').removeClass('btnCheck');
    document.getElementById("JumpMenu").style.display = "none";
    document.getElementById("loading1").style.display = "none";
    document.getElementById("loading2").style.display = "block";
    document.getElementById("loading3").style.display = "none";
    document.getElementById("DisplayShowRewards").style.display = "none";
    document.getElementById("DisplayRedeemRewards").style.display = "none";
    document.getElementById("DisplayDoneRewards").style.display = "none";
    LoadRedeem();
  } else if(x==3) { 
    $('#mm1').removeClass('btnCheck');
    $('#mm2').removeClass('btnCheck');
    $('#mm3').addClass('btnCheck');
    document.getElementById("JumpMenu").style.display = "none";
    document.getElementById("loading1").style.display = "none";
    document.getElementById("loading2").style.display = "none";
    document.getElementById("loading3").style.display = "block";
    document.getElementById("DisplayShowRewards").style.display = "none";
    document.getElementById("DisplayRedeemRewards").style.display = "none";
    document.getElementById("DisplayDoneRewards").style.display = "none";
    DoneRedeem();
  }
}




var sCodeStock = 0;
function LoadReward() {
  //alert(sessionStorage.getItem("ActivePoint"));
  var i = 0;
  var str = "";
  var xtr = "";
  var RatioPoint = sessionStorage.getItem("ActivePoint");

  xtr += '<div style="margin-top:20px;">';
  xtr += '<a href="#Point1"><div class="box-1">250,000<br>Pru Point<br><font color="#ffff00">12 รายการ</font></div></a>';
  xtr += '<a href="#Point2"><div class="box-1">500,000<br>Pru Point<br><font color="#ffff00">15 รายการ</font></div></a>';
  xtr += '<a href="#Point3"><div class="box-1">1,000,000<br>Pru Point<br><font color="#ffff00">12 รายการ</font></div></a>';
  xtr += '<a href="#Point4"><div class="box-1">2,000,000<br>Pru Point<br><font color="#ffff00">9 รายการ</font></div></a>';
  xtr += '</div><div class="clr"></div>';
  $("#JumpMenu").html(xtr);

  str += '<div class="clr" style="height:13px;margin-top:20px;"></div><div class="group-remark"><b>รอบการแลกของรางวัล</b><br>';
  str += '- ทุกวันที่ 25-30 ของเดือน<br><br><b>รอบการส่งมอบของรางวัล</b><br>- หลังจากแลกคะแนนภายใน 60 วันทำการ<br>- รายการของรางวัลสามารถเปลี่ยนแปลงได้ตามความเหมาะสม</div>';
  sCodeStock = 0
  dbPRUstock
  .orderBy('StockGroup','asc')
  .orderBy('StockOrder','asc')
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      str += '<div class="clr"></div>';
      if(doc.data().StockGroup!=sCodeStock) {
        if(doc.data().StockGroup==1) {
          str += '<div id="Point1"></div>';
          str += '<center><div class="btn-leaderboard">ตั้งแต่ 250,000 PRU Point</div></center>';
        } else if(doc.data().StockGroup==2) {
          str += '<div id="Point2"></div>';
          str += '<center><div class="btn-leaderboard">ตั้งแต่ 500,000 PRU Point</div></center>';
        } else if (doc.data().StockGroup==3) {
          str += '<div id="Point3"></div>';
          str += '<center><div class="btn-leaderboard">ตั้งแต่ 1,000,000 PRU Point</div></center>';
        } else if (doc.data().StockGroup==4) {
          str += '<div id="Point4"></div>';
          str += '<center><div class="btn-leaderboard">ตั้งแต่ 2,000,000 PRU Point ขึ้นไป</div></center>';
        }
        sCodeStock = doc.data().StockGroup;
      }
      i = i+1;
      var RatioPoint = 0;
      //str += '<div class="btn-rewards" style="width:94%; margin:auto;border: 2px solid #eaeaea; margin-bottom: 12px; border-radius: 8px; background-color:#f2f2f2;">';
      RatioPoint = ((parseFloat(sessionStorage.getItem("ActivePoint"))/parseFloat(doc.data().PointRedeem))*100);


    if(doc.data().StockStatus==1) {
      if(RatioPoint<100) {
        str += '<div class="btn-rewards" style="width:94%; margin:auto;border: 2px solid #eaeaea; margin-bottom: 12px; border-radius: 8px; background-color:#f2f2f2;">';
        str += '<div style="width:32%; float: left; padding:2px;min-height: 80px; overflow: hidden;"><div class="boxvdo-img"><img src="'+doc.data().StockImg+'" class="img-fluid" style="width:100%;">';
        str += '<div class="progress"><div class="bar2" style="width:'+RatioPoint.toFixed(2)+'%">';
        str += '</div></div></div></div>';
        //str += '<p class="percent">'+RatioPoint.toFixed(2)+'%</p></div></div></div></div>';
        str += '<div class="boxvdo-line10" style="width:62%; float: left; padding:2px;line-height: 1.1; min-height: 60px; overflow: hidden;"><div class="boxvdo-header">'+doc.data().StockName+'</div>'+doc.data().StockDetail+'</div>';
        if(sessionStorage.getItem("ActivePoint")!="NaN") {
          str += '<div class="boxvdo-line2"><div class="btn-t2-block" style="font-size:13px;">ใช้ '+addCommas(doc.data().PointRedeem)+' PRU Point</div></div>'; 
        }
        str += '<div class="clr"></div></div>';
      } else {
        str += '<div class="btn-rewards" style="width:94%; margin:auto;border: 2px solid #eaeaea; margin-bottom: 12px; border-radius: 8px; background-color:#f2f2f2;">';
        str += '<div style="width:32%; float: left; padding:2px;min-height: 80px; overflow: hidden;"><div class="boxvdo-img"><img src="'+doc.data().StockImg+'" class="img-fluid" style="width:100%;">';
        str += '<div class="progress"><div class="bar1" style="width:'+RatioPoint.toFixed(2)+'%">';
        str += '</div></div></div></div>';
        //str += '<p class="percent">'+RatioPoint.toFixed(2)+'%</p></div></div></div></div>';
        str += '<div class="boxvdo-line10" style="width:62%; float: left; padding:2px;line-height: 1.1; min-height: 60px; overflow: hidden;"><div class="boxvdo-header">'+doc.data().StockName+'</div>'+doc.data().StockDetail+'</div>';
        if(sessionStorage.getItem("ActivePoint")!="NaN") {
          str += '<div class="boxvdo-line2"><div class="btn-t2-no" style="font-size:13px;" onclick="RedeemPoint(\''+ doc.id +'\','+i+')">ใช้ '+addCommas(doc.data().PointRedeem)+' PRU Point</div></div>'; 
        }
        str += '<div class="clr"></div></div>';
      }
    } else {
      str += '<div class="btn-rewards imgblack" style="width:94%; margin:auto;border: 2px solid #eaeaea; margin-bottom: 12px; border-radius: 8px; background-color:#f2f2f2;">';
      str += '<div style="width:32%; float: left; padding:2px;min-height: 80px; overflow: hidden;"><div class="boxvdo-img"><img src="'+doc.data().StockImg+'" class="img-fluid" style="width:100%;">';
      str += '<div class="progress"><div class="bar2" style="width:'+RatioPoint.toFixed(2)+'%">';
      str += '</div></div></div></div>';
      str += '<div class="boxvdo-line10" style="width:62%; float: left; padding:2px;line-height: 1.1; min-height: 60px; overflow: hidden;"><div class="boxvdo-header">'+doc.data().StockName+'</div>'+doc.data().StockDetail+'</div>';
      if(sessionStorage.getItem("ActivePoint")!="NaN") {
        str += '<div class="boxvdo-line2"><div class="btn-t0" style="font-size:13px; color:#fff2f2;border:2px solid #cec5c5;">ใช้ '+addCommas(doc.data().PointRedeem)+' PRU Point</div></div>'; 
      }
      str += '<div class="clr"></div></div>';
    }
    });
    $("#DisplayShowRewards").html(str);
    document.getElementById("loading1").style.display = "none";
    document.getElementById("DisplayShowRewards").style.display = "block";
    //document.getElementById("DisplayNotOpen").style.display = "block";
  });
}


function RedeemPoint(id) {
  var str = "";
  dbPRUstock.where(firebase.firestore.FieldPath.documentId(), "==", id)
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      EidStockID = doc.id;
      PointForRedeem = doc.data().PointRedeem;
      sStockName = doc.data().StockName;
      sStockRedeem = doc.data().StockRedeem;
      sStockImg = doc.data().StockImg;
      sStockDetail = doc.data().StockDetail;
      var xTotalPoint = sessionStorage.getItem("ActivePoint") - doc.data().PointRedeem;
      str += '<div class="font14" style="margin:-5px auto 10px auto; color:#ff0000; font-weight: 600;"><u>Pru Pround Club</u></div>';
      str += '<div class="boxvdo-img"><img src="'+doc.data().StockImg+'" class="img-fluid"></div><div class="clr"></div>';
      str += '<div class="boxvdo-header" style="margin-top:8px;text-align:center;">'+ doc.data().StockName +'</div>';
      str += '<div class="boxvdo-header" style="margin-top:8px;text-align:left; color:#777;">'+ doc.data().StockDetail +'</div>';

      str += '<table class="table table-bordered" class="font13" style="background-color: #fff; margin-top:10px;">';
      str += '<thead><tr style="text-align: center;background-color: #93a3c1;">';
      str += '<th scope="col">รายการ</th><th scope="col">รายละเอียด</th><th scope="col">หน่วย</th></tr></thead><tbody>';
      str += '<tr><th scope="row" style="text-align: left;">PRU Point ของคุณ</th>';
      str += '<td style="text-align: right; font-weight: 600;">'+ numberWithCommas(sessionStorage.getItem("ActivePoint")) +'</td>';
      str += '<td style="text-align: center;">Point</td></tr>';
      str += '<tr><th scope="row" style="text-align: left;">PRU Point ที่ใช้แลก</th>';
      str += '<td style="text-align: right; font-weight: 600;">'+ numberWithCommas(doc.data().PointRedeem) +'</td>';
      str += '<td style="text-align: center;">Point</td></tr>';
      str += '<tr><th scope="row" style="text-align: left;">PRU Point คงเหลือ</th>';
      str += '<td style="text-align: right; font-weight: 600;">'+ numberWithCommas(xTotalPoint) +'</td>';
      str += '<td style="text-align: center;">Point</td></tr></tbody></table>';
      if(xTotalPoint>=0) {
        str += '<center><div class="btn-t2-no" onclick="ConfirmRedeem(\''+ doc.id +'\')">ยืนยันการแลกรางวัล</div>';
        str += '<div class="btn-t2-ok" onclick="CloseAll()">ยกเลิกรายการ</div></center>';
      } else {
        str += '<center><div class="btn-t1" onclick="CloseAll()">ปิดหน้าต่างนี้</div></center>';
      }
    });
    $("#DisplayByItem").html(str);
  });
  document.getElementById("id01").style.display = "block";
}


function LoadRedeem() {
  var str = "";
  var xCheck = 0;
  //str += '<div class="clr" style="margin-top:30px;"></div>';
  str += '<div class="clr" style="height:13px;margin-top:20px;"></div><div class="group-remark" style="text-align:center;"><b>รายการแลกรางวัลของคุณ</b></div>';
  dbPRUstocklog.where('EmpID','==',sessionStorage.getItem("EmpID_PRU"))
  .where('StatusRedeem','==',0)
  .orderBy('RedeemTimeStamp','desc')
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      xCheck = 1;
      str += '<div class="col-lg-6 col-md-2 slide text-center boxvdo" data-aos="fade-left" style="min-height: 100px;"><div class="btn-rewards">';
      str += '<div class="boxvdo-border member" style="min-height: 100px;"><div class="boxvdo-img"  style="width:37%;">';
      str += '<img src="'+doc.data().StockImg+'" class="img-fluid" style="border-radius: 10px;"></div>';
      str += '<div class="boxvdo-title"><div class="boxvdo-header">'+doc.data().StockName+'</div>';
      str += '<div class="boxvdo-line1">'+doc.data().StockDetail+'</div>';
      str += '<div class="boxvdo-line2" style="color:#f68b1f;">Point ที่แลก : '+ numberWithCommas(parseFloat(doc.data().PointRedeem).toFixed(2)) +' <br>แลกเมื่อ : '+doc.data().DateRedeem+'</div>';
      str += '</div></div></div></div>';
    });
    if(xCheck==0) {
      str = "";
      str += '<div class="clr" style="height:13px;margin-top:20px;"></div><div class="group-remark" style="padding-top:30px; padding-bottom:40px; text-align:center; font-weight:600; background-color:#eeeeee;">ยังไม่มีรายการแลก<br>ของรางวัล ของคุณ</div>';
    }
    $("#DisplayRedeemRewards").html(str);
    document.getElementById("loading2").style.display = "none";
    document.getElementById("DisplayRedeemRewards").style.display = "block";
/*
    document.getElementById("loading2").style.display = "none";
*/
  });
}


function DoneRedeem() {
  var str = "";
  var xCheck = 0;
  str += '<div class="clr" style="height:13px;margin:0px auto 20px auto;"></div><div class="group-remark" style="text-align:center;"><b>รายการแลกรางวัลสำเร็จของคุณ</b></div>';
  str += '<table class="table table-bordered table-striped table-responsive-stack" style="margin:10px auto;width:95%;">';
  str += '<thead class="thead-dark"><tr><th>รายการยืนยันการแลกรางวัล</th></tr></thead><tbody>';
  dbStockConfirm.where('EmpID','==',parseFloat(sessionStorage.getItem("EmpID_PRU")))
  .orderBy('DateRedeem','desc')
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      xCheck = 1;
      str += '<tr>';
      str += '<td style="line-height: 1.3; font-size:13px; ">รายการสินค้า <font color="#f68b1f"><b>'+doc.data().StockName+'</b></font>';
      str += '<br>คะแนนที่แลก <font color="#0056ff">'+addCommas(doc.data().PointRedeem)+' คะแนน</font><br>';
      str += 'วันที่แลก <font color="#0056ff">'+doc.data().DateRedeem+'</font><br>วันที่นำจ่าย ';
      str += '<font color="#0056ff">'+doc.data().DateConfirm+'</font></td>';
      str += '</tr>';
    });
    str += '</tbody></table>';
    if(xCheck==0) {
      str = "";
      str += '<div class="clr" style="height:13px;margin-top:20px;"></div><div class="group-remark" style="padding-top:30px; padding-bottom:40px; text-align:center; font-weight:600; background-color:#eeeeee;">ยังไม่มีการทำรายการสำเร็จ<br>ในการแลกของรางวัลของคุณ</div>';
    }
    $("#DisplayDoneRewards").html(str);
    document.getElementById("DisplayDoneRewards").style.display = "block";
    document.getElementById("loading3").style.display = "none";
  });
}



function ConfirmRedeem(id) {
  NewDate();
  var TimeStampDate = Math.round(Date.now() / 1000);
  console.log("StockName = " + sStockName);

  dbPRUstocklog.add({
    LineID : sessionStorage.getItem("LineID"),
    LineName : sessionStorage.getItem("LineName"),
    LinePicture : sessionStorage.getItem("LinePicture"),
    //EmpGroup : sessionStorage.getItem("EmpGroup"),
    EmpID : sessionStorage.getItem("EmpID_PRU"),
    EmpName : sessionStorage.getItem("EmpName_PRU"),
    StockName : sStockName,
    StockImg : sStockImg,
    StockDetail : sStockDetail,
    ActivePoint : parseFloat(sessionStorage.getItem("ActivePoint")),
    PointRedeem : parseFloat(PointForRedeem),
    LastPoint : parseFloat(sessionStorage.getItem("ActivePoint"))-parseFloat(PointForRedeem),
    DateRedeem : dateString,
    StatusRedeem : 0,
    DateConfirm : "",
    MemoConfirm : "",
    RedeemTimeStamp : TimeStampDate
  });
  if(parseFloat(sessionStorage.getItem("ActivePoint"))>=parseFloat(PointForRedeem)) {
    dbPRUredeemPoint.doc(EidRedeemPoint).update({
      TotalPointRedeem : parseFloat(sTotalPointRedeem)+parseFloat(PointForRedeem),
      TotalItemRedeem : parseFloat(sTotalItemRedeem)+1,
      DateRedeem : dateString
    });    
    CheckRedeemPoint();
    sessionStorage.setItem("ActivePoint", parseFloat(sessionStorage.getItem("ActivePoint"))-parseFloat(PointForRedeem) );
    $("#DisplayLastPoint").html('<div class="btn-orange" style="margin-top:-4px;font-size: 14px;">คุณมี '+ addCommas(sessionStorage.getItem("ActivePoint")) +' Point</div>');
    document.getElementById("DisplayShowRewards").style.display = "block";
    LoadReward();
    document.getElementById('id01').style.display='none';
    document.getElementById('id02').style.display='block';
  }
  DisplayPoint();
}


function DisplayPoint() {
  var xLine = "";
  xLine += '<div style="margin: 20px auto 20px auto; width: 100%; min-height:50px; max-width: 450px;">';
  xLine += '<div style="width:70%; float: left;">';
  xLine += '<div style="width:100%;"><div style="width:32%;float: left; text-align: center;"><img src="'+ sessionStorage.getItem("LinePicture") +'" class="Profile-img"></div>';
  xLine += '<div class="Profile-title" style="padding-top:5px;color:#fff;"><b>'+ sessionStorage.getItem("EmpName_PRU") +'</b><br>'+ sessionStorage.getItem("LineName") +'</div>';
  xLine += '</div></div>';
  xLine += '<div style="width:28%; float: left; background-color :#ff0000; height:50px; text-align: center; border-radius: 8px;margin-top:5px;">';
  xLine += '<div class="box-reward" style="width:100%; padding-top:4px; font-size: 10px;"><div class="XPpoint">'+ numberWithCommas(parseFloat(sessionStorage.getItem("ActivePoint")).toFixed(2)) +'</div>PRU Point</div>';
  xLine += '</div>';  
  $("#DisplayPoint").html(xLine); 
}


function numberWithCommas(num) {
  var valueString=num; //can be 1500.0 or 1500.00 
  var amount=parseFloat(valueString).toFixed(2);
  return formattedString= amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function addCommas(nStr) {
  nStr += '';
  x = nStr.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
}


function NewDate() {
  var today = new Date();
  var day = today.getDate() + "";
  var month = (today.getMonth() + 1) + "";
  var year = today.getFullYear() + "";
  var hour = today.getHours() + "";
  var minutes = today.getMinutes() + "";
  var seconds = today.getSeconds() + "";
  var ampm = hour >= 12 ? 'PM' : 'AM';
  day = checkZero(day);
  month = checkZero(month);
  year = checkZero(year);
  hour = checkZero(hour);
  minutes = checkZero(minutes);
  seconds = checkZero(seconds);
  dateString = day + "/" + month + "/" + year + " " + hour + ":" + minutes + ":" + seconds +" "+ ampm;
}


function checkZero(data){
  if(data.length == 1){
    data = "0" + data;
  }
  return data;
}

function CloseAll() {
  $("#DisplayByItem").html('');
  document.getElementById('id01').style.display='none';
  document.getElementById('id02').style.display='none';
}

