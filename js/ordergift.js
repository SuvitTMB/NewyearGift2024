var dateString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear()+543;
var gID, gStatus;
var xMaxGift = 0;
var xNewyearLimit = 22;
var xOrderLimit = 100;
var xBMStatus = 0;
var xSendZoneApprove = 0;

var zBM_Address = "";
var zBM_Phone = "";
var zEmpID_Staff1 = "";
var zEmpName_Staff1 = "";
var zPhone_Staff1 = "";
var zEmpID_Staff2 = "";
var zEmpName_Staff2 = "";
var zPhone_Staff2 = "";
var zZoneMemoToBM = "";


$(document).ready(function () {
  if(sessionStorage.getItem("EmpID_Newyear")==null) { location.href = "index.html"; }
  gID = getParameterByName('gid');
  gStatus = getParameterByName('gStatus');
  Connect_DB();
  dbNewyearData = firebase.firestore().collection("Newyear2024_data");
  dbGiftStock = firebase.firestore().collection("Newyear2024_gift");
  dbGiftOrder = firebase.firestore().collection("Newyear2024_order");
  CheckBudget();
  GetUserOrder(gID);
  LoadGiftStock();
});


function getParameterByName(name, url) {
  str = '';
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}



function LoadDetail() {
  dbNewyearData.where(firebase.firestore.FieldPath.documentId(), "==", gID)
  .get().then((snapshot)=> {
  snapshot.forEach(doc=> {
      xBMStatus = doc.data().BMStatus;
      zBM_Address = doc.data().BM_Address;
      zBM_Phone = doc.data().BM_Phone;
      zEmpID_Staff1 = doc.data().EmpID_Staff1;
      zEmpName_Staff1 = doc.data().EmpName_Staff1;
      zPhone_Staff1 = doc.data().Phone_Staff1;
      zEmpID_Staff2 = doc.data().EmpID_Staff2;
      zEmpName_Staff2 = doc.data().EmpName_Staff2;
      zPhone_Staff2 = doc.data().Phone_Staff2;
      zZoneMemoToBM = doc.data().ZoneMemoToBM;
    });
    //console.log("Load Detail");
  });
}


var xBMAllocated = 0;
var xBMEmpID = "";
var xBMName = "";
var xBranchName = "";
var xZone = "";
var xRH = "";
function CheckBudget() {
  var str = "";
  var xStatus = "";
  str += '<table class="table table-bordered" class="font13" style="margin-top:20px; background-color: #fff;">';
  str += '<thead><tr style="text-align: center;background-color: #93a3c1;">';
  str += '<th scope="col">รายการ</th><th scope="col">รายละเอียด</th></tr></thead><tbody>';
  dbNewyearData.where(firebase.firestore.FieldPath.documentId(), "==", gID)
  .get().then((snapshot)=> {
  snapshot.forEach(doc=> {
      //xStatus = "";
      xBMStatus = doc.data().BMStatus;
      if(doc.data().BMStatus==0) { 
        xMsg = "คลิก<br>สั่งจอง";
        xStatus = "<font color='#555555'><b>ยังไม่ได้สั่งจอง</b></font>";
      } else if(doc.data().BMStatus==1) {
        xMsg = "กำลัง<br>สั่งจอง";
        xStatus = "<font color='#f68b1f'><b>อยู่ระหว่างการสั่งจอง</b></font>";
      } else if(doc.data().BMStatus==2) {
        xMsg = "ส่งโซน<br>ขออนุมัติ";
        xStatus = "<font color='#0056ff'><b>ส่งโซนอนุมัติ</b></font>";
      } else if(doc.data().BMStatus==3) {
        xMsg = "โซนแจ้ง<br>ทบทวน";
        xStatus = "<font color='#ff0000'><b>โซนแจ้งทบทวนใหม่</b></font>";
      } else if(doc.data().BMStatus==8) {
        xMsg = "โซนแจ้ง<br>ยกเลิก";
        xStatus = "<font color='#ff0000'><b>โซนแจ้งขอยกเลิกการจอง</b></font>";
      } else if(doc.data().BMStatus==9) {
        xMsg = "โซนแจ้ง<br>อนุมัติ";
        xStatus = "<font color='#28c92a'><b>โซนอนุมัติเรียบร้อยแล้ว</b></font>";
      }
      xBMEmpID = doc.data().BMEmpID;
      xBMName = doc.data().BMName;
      xBranchName = doc.data().BranchName +" ("+ doc.data().BranchID +")";
      xZone = doc.data().EmpZone;
      xRH = doc.data().EmpRH;
      str += '<tr>';
      str += '<td style="text-align: left; line-height: 1.2;background-color:#d5dae2">สาขา</td>';
      str += '<td style="text-align: center;background:#c4d0e2;"><b>'+ doc.data().BranchName +' ('+ doc.data().BranchID +')</b></td></tr>';
      str += '<td style="text-align: left; line-height: 1.2;background-color:#d5dae2">BM</td>';
      str += '<td style="text-align: center;background:#c4d0e2;"><b>'+ doc.data().BMName +'</b></td></tr>';
      str += '<td style="text-align: left; line-height: 1.2;background-color:#d5dae2">สถานะ</td>';
      str += '<td style="text-align: center;background:#c4d0e2;"><b>'+ xStatus +'</b></td></tr>';
      str += '<td style="text-align: left; line-height: 1.2;background-color:#d5dae2">งบสั่งจอง</td>';
      str += '<td style="text-align: center;background:#c4d0e2;"><b>'+ numberWithCommas(doc.data().BMAllocated) +' บาท</b></td></tr>';
      str += '<td style="text-align: left; line-height: 1.2;background-color:#d5dae2">สั่งไปแล้ว</td>';
      str += '<td style="text-align: center;background:#c4d0e2;"><b>'+ numberWithCommas(doc.data().UseBudget) +' บาท</b></td></tr>';
      xBMAllocated = doc.data().BMAllocated;
    });
    str += '</tbody></table></div>';
    str += '<div class="clr"></div>';
    $("#DisplayBudget").html(str);
  });
}



var GetOrderArr = [];
function GetUserOrder(gID) {
  var i = 0;
  //GetOrderArr = [];
  //console.log(gID);
  dbGiftOrder.where('RefID','==',gID)
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      GetOrderArr.push({ RefGift: doc.data().RefGift, StockName: doc.data().StockName, OrderGift: doc.data().OrderGift, ID: doc.id });
    });    
    //console.log(GetOrderArr);
  });
}


var xCheckOrder = 0;
var xCountRec = 0;
var xSumAllPrice = 0;
var xSumUnitPrice = 0;
var xTotalUnitPrice = 0;
var xBalance = 0;
function LoadGiftStock() {
  LoadDetail();
  var str = "";
  var i = 0;
  var xOrder = 0;
  xSumAllPrice = 0;
  xSumUnitPrice = 0;
  xMaxGift = 0;
  xCalSell = 0;

  str += '<table class="table table-bordered" class="font13" style="background-color: #fff;">';
  str += '<thead><tr style="text-align: center;background-color: #93a3c1;">';
  str += '<th scope="col">No.</th><th scope="col">รายการของขวัญ</th></tr></thead><tbody>';
  dbGiftStock.where('StockStatus','==',1)
  //.where('StockGroup','==','asc')
  .orderBy('StockGroup','asc')
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      //console.log(doc.id+"--- id"+i);
      const results = GetOrderArr.filter(obj => {return obj.RefGift === doc.id;});
      xResults = 0;
      xCheckLine = 0;
      if(results[0]!=undefined) { 
        xResults = results[0].OrderGift;
        xCheckOrder = parseFloat(xCheckOrder) + parseFloat(results[0].OrderGift);
      }
      str += '<tr><th scope="row" style="text-align: center;">'+ (i+1) +'<div onclick="DisplayGift(\''+ doc.id +'\')"><img src="./img/icon-02.png" style="width:20px;"></div></th>';
      str += '<td style="text-align: left; line-height: 1.2;"><div onclick="DisplayGift(\''+ doc.id +'\')"><font color="#0056ff"><b>'+ doc.data().StockName +'</b></font></div>';

      str += '<div style="margin-top:4px;">';
      str += '<div class="box-price"><div style="font-size:12px;">เลือกจำนวนชิ้น</div>';
      //if(results[0].OrderGift!=0) {
      //  alert(results[0].OrderGift);
      //}
      //  str += '<select name="OrderGiftID" onfocus="CalGift()" id="OrderGiftID'+ i +'" value="'+ results[0].OrderGift +'" class="form-control">';
      //  alert("ok");
      //} else {
        str += '<select name="OrderGiftID" onchange="CalGift()" id="OrderGiftID'+ i +'" value="'+ xResults +'" class="form-control">';
      //}
      if(doc.data().StockView==1) {
        for (let k = 0; k < xNewyearLimit; k++) {
          if(k==0) {
            str += '<option onchange="CalGift(0)" value="0">รอการสั่ง</option>';
          } else {
            if( xResults==(k*50) ) {
              xCheckLine = 1;
              str += '<option onchange="CalGift('+ k +')" value="'+ results[0].OrderGift +'" selected>'+ results[0].OrderGift +' ชิ้น</option>';
            } else {
              str += '<option onchange="CalGift('+ k +')" value="'+ (k*50) +'">'+ (k*50) +' ชิ้น</option>';
            }
          }
        }
      } else if(doc.data().StockView==2) { 
        for (let j = 0; j < (xOrderLimit+1); j++) {
          if(j==0) {
            str += '<option onchange="CalGift(0)" value="0">รอการสั่ง</option>';
          } else { 
            if( xResults==j ) {
              xCheckLine = 1;
              str += '<option onchange="CalGift('+ j +')" value="'+ results[0].OrderGift +'" selected>'+ results[0].OrderGift +' ชิ้น</option>';
            } else {
              str += '<option onchange="CalGift('+ j +')" value="'+ j +'">'+ j +' ชิ้น</option>';
            }
          }
        }
      }
      xCalSell += xResults * doc.data().PointRedeem;
      str += '</select></div>';
      str += '<div class="box-price"><div style="font-size:12px;">ราคาต่อชิ้น</div><input type="text" id="UnitPrice'+ i +'" value="'+ doc.data().PointRedeem +'" readonly></div>';
      str += '<div class="box-price"><div style="font-size:12px;">จำนวนเงินที่ใช้</div><div class="box-order" id="SumUnitPrice'+ i +'" value="'+ (xResults * doc.data().PointRedeem) +'" readonly></div></div>';
      str += '</td>';
      str += '</tr>';
      //str += '<input type="text" id="OrderGiftIDx'+ i +'" value="'+ doc.data().PointRedeem +'" hidden>';
      str += '<input type="text" id="OrderGiftRefID'+ i +'" value="'+ doc.id +'" hidden>';
      str += '<input type="text" id="NameGift'+ i +'" value="'+ doc.data().StockName +'" hidden>';

      i++;
      xMaxGift++;
    });
    str += '</tbody></table></div>';
    str += '<div class="clr"></div>';
    $("#DisplayGroup2").html(str);
    CalGift();
  });
}



var xTotalPrice = 0;
function CalGift() {
  var i = 0;
  var str = "";
  var SumItem = 0;

//console.log(xMaxGift+"==="+ xResults+"==="+xCheckLine);


//for (let i = 0; i < xMaxGift; i++) {
//  var xSumUnitPrice&''&i = document.getElementById("UnitPrice"+i).value;
//  console.log(document.getElementById("UnitPrice"+i).value);
//}
/*
  if(xMaxGift==1) {
    var xSumUnitPrice0 = parseFloat(document.getElementById("UnitPrice0").value * document.getElementById("OrderGiftID0").value);
    xTotalUnitPrice = parseFloat(document.getElementById("OrderGiftID0").value);
    xTotalPrice = parseFloat(xSumUnitPrice0);
  } else if(xMaxGift==2) { 
    var xSumUnitPrice0 = parseFloat(document.getElementById("UnitPrice0").value * document.getElementById("OrderGiftID0").value);
    var xSumUnitPrice1 = parseFloat(document.getElementById("UnitPrice1").value * document.getElementById("OrderGiftID1").value);
    xTotalUnitPrice = parseFloat(document.getElementById("OrderGiftID0").value) + parseFloat(document.getElementById("OrderGiftID1").value);
    xTotalPrice = parseFloat(xSumUnitPrice0) + parseFloat(xSumUnitPrice1);
  } else if(xMaxGift==3) { 
    var xSumUnitPrice0 = parseFloat(document.getElementById("UnitPrice0").value * document.getElementById("OrderGiftID0").value);
    var xSumUnitPrice1 = parseFloat(document.getElementById("UnitPrice1").value * document.getElementById("OrderGiftID1").value);
    var xSumUnitPrice2 = parseFloat(document.getElementById("UnitPrice2").value * document.getElementById("OrderGiftID2").value);
    xTotalUnitPrice = parseFloat(document.getElementById("OrderGiftID0").value) + parseFloat(document.getElementById("OrderGiftID1").value) + parseFloat(document.getElementById("OrderGiftID2").value);
    xTotalPrice = parseFloat(xSumUnitPrice0) + parseFloat(xSumUnitPrice1) + parseFloat(xSumUnitPrice2);
  }
*/
  //SumItem = addCommas(document.getElementById("OrderGiftID0").value) + addCommas(document.getElementById("OrderGiftID1").value) + addCommas(document.getElementById("OrderGiftID2").value);


  var xSumUnitPrice0 = parseFloat(document.getElementById("UnitPrice0").value * document.getElementById("OrderGiftID0").value);
  var xSumUnitPrice1 = parseFloat(document.getElementById("UnitPrice1").value * document.getElementById("OrderGiftID1").value);
  var xSumUnitPrice2 = parseFloat(document.getElementById("UnitPrice2").value * document.getElementById("OrderGiftID2").value);
  var xSumUnitPrice3 = parseFloat(document.getElementById("UnitPrice3").value * document.getElementById("OrderGiftID3").value);
  var xSumUnitPrice4 = parseFloat(document.getElementById("UnitPrice4").value * document.getElementById("OrderGiftID4").value);
  var xSumUnitPrice5 = parseFloat(document.getElementById("UnitPrice5").value * document.getElementById("OrderGiftID5").value);
  var xSumUnitPrice6 = parseFloat(document.getElementById("UnitPrice6").value * document.getElementById("OrderGiftID6").value);
  var xSumUnitPrice7 = parseFloat(document.getElementById("UnitPrice7").value * document.getElementById("OrderGiftID7").value);
  var xSumUnitPrice8 = parseFloat(document.getElementById("UnitPrice8").value * document.getElementById("OrderGiftID8").value);

  var xSumUnitPrice9 = parseFloat(document.getElementById("UnitPrice9").value * document.getElementById("OrderGiftID9").value);
  var xSumUnitPrice10 = parseFloat(document.getElementById("UnitPrice10").value * document.getElementById("OrderGiftID10").value);
  var xSumUnitPrice11 = parseFloat(document.getElementById("UnitPrice11").value * document.getElementById("OrderGiftID11").value);
  var xSumUnitPrice12 = parseFloat(document.getElementById("UnitPrice12").value * document.getElementById("OrderGiftID12").value);
  var xSumUnitPrice13 = parseFloat(document.getElementById("UnitPrice13").value * document.getElementById("OrderGiftID13").value);
  var xSumUnitPrice14 = parseFloat(document.getElementById("UnitPrice14").value * document.getElementById("OrderGiftID14").value);
  var xSumUnitPrice15 = parseFloat(document.getElementById("UnitPrice15").value * document.getElementById("OrderGiftID15").value);

  var AA = parseFloat(document.getElementById("OrderGiftID0").value) + parseFloat(document.getElementById("OrderGiftID1").value) + parseFloat(document.getElementById("OrderGiftID2").value) + parseFloat(document.getElementById("OrderGiftID3").value)+ parseFloat(document.getElementById("OrderGiftID4").value)+ parseFloat(document.getElementById("OrderGiftID5").value)+ parseFloat(document.getElementById("OrderGiftID6").value);
  var BB = parseFloat(document.getElementById("OrderGiftID7").value) + parseFloat(document.getElementById("OrderGiftID8").value) + parseFloat(document.getElementById("OrderGiftID9").value) + parseFloat(document.getElementById("OrderGiftID10").value)+ parseFloat(document.getElementById("OrderGiftID11").value)+ parseFloat(document.getElementById("OrderGiftID12").value)+ parseFloat(document.getElementById("OrderGiftID13").value);
  var CC = parseFloat(document.getElementById("OrderGiftID14").value)+ parseFloat(document.getElementById("OrderGiftID15").value);
  xTotalUnitPrice = AA + BB + CC; 
  var XX = parseFloat(xSumUnitPrice0) + parseFloat(xSumUnitPrice1) + parseFloat(xSumUnitPrice2) + parseFloat(xSumUnitPrice3) + parseFloat(xSumUnitPrice4) + parseFloat(xSumUnitPrice5) ;
  var YY = parseFloat(xSumUnitPrice6) + parseFloat(xSumUnitPrice7) + parseFloat(xSumUnitPrice8) + parseFloat(xSumUnitPrice9) + parseFloat(xSumUnitPrice10) + parseFloat(xSumUnitPrice11) ;
  var ZZ = parseFloat(xSumUnitPrice12) + parseFloat(xSumUnitPrice13) + parseFloat(xSumUnitPrice14) + parseFloat(xSumUnitPrice15);
  xTotalPrice = XX + YY + ZZ;
  xBalance = xBMAllocated - xTotalPrice;
  //xTotalUnitPrice = parseFloat(document.getElementById("OrderGiftID0").value) + parseFloat(document.getElementById("OrderGiftID1").value) + parseFloat(document.getElementById("OrderGiftID2").value) + parseFloat(document.getElementById("OrderGiftID3").value)+ parseFloat(document.getElementById("OrderGiftID4").value)+ parseFloat(document.getElementById("OrderGiftID5").value)+ parseFloat(document.getElementById("OrderGiftID6").value)+ parseFloat(document.getElementById("OrderGiftID7").value)+ parseFloat(document.getElementById("OrderGiftID8").value);
  //xTotalPrice = parseFloat(xSumUnitPrice0) + parseFloat(xSumUnitPrice1) + parseFloat(xSumUnitPrice2)  + parseFloat(xSumUnitPrice3) + parseFloat(xSumUnitPrice4) + parseFloat(xSumUnitPrice5) + parseFloat(xSumUnitPrice6) + parseFloat(xSumUnitPrice7) + parseFloat(xSumUnitPrice8);

  //SumItem = addCommas(document.getElementById("OrderGiftID0").value);
  $("#SumUnitPrice0").html(numberWithCommas(xSumUnitPrice0));
  $("#SumUnitPrice1").html(numberWithCommas(xSumUnitPrice1));
  $("#SumUnitPrice2").html(numberWithCommas(xSumUnitPrice2));
  $("#SumUnitPrice3").html(numberWithCommas(xSumUnitPrice3));
  $("#SumUnitPrice4").html(numberWithCommas(xSumUnitPrice4));
  $("#SumUnitPrice5").html(numberWithCommas(xSumUnitPrice5));
  $("#SumUnitPrice6").html(numberWithCommas(xSumUnitPrice6));
  $("#SumUnitPrice7").html(numberWithCommas(xSumUnitPrice7));
  $("#SumUnitPrice8").html(numberWithCommas(xSumUnitPrice8));


  $("#SumUnitPrice9").html(numberWithCommas(xSumUnitPrice9));
  $("#SumUnitPrice10").html(numberWithCommas(xSumUnitPrice10));
  $("#SumUnitPrice11").html(numberWithCommas(xSumUnitPrice11));
  $("#SumUnitPrice12").html(numberWithCommas(xSumUnitPrice12));
  $("#SumUnitPrice13").html(numberWithCommas(xSumUnitPrice13));
  $("#SumUnitPrice14").html(numberWithCommas(xSumUnitPrice14));
  $("#SumUnitPrice15").html(numberWithCommas(xSumUnitPrice15));



  str += '<div class="clr"></div>';
  str += '</div><div style="margin-top:30px;padding-top:20px;margin-left:3px;">';
  str += '<div class="box-price"><div style="font-size:12px;font-weight:600;">งบประมาณที่ได้รับ</div><input type="text" value="'+ numberWithCommas(xBMAllocated) +'" style="color:#fff;background:#002d63;"></div></div>';
  //str += '<div class="box-price"><div style="font-size:12px;font-weight:600;">รวมจำนวนชิ้นที่สั่ง</div><input type="text" value="'+ addCommas(xTotalUnitPrice) +'" style="color:#fff;background:#6d7178;"></div></div>';
  //if(xTotalPrice>xBMAllocated) {
  //  str += '<div class="box-price"><div style="font-size:12px;font-weight:600;">จำนวนเงินที่สั่ง</div><input type="text" value="'+ numberWithCommas(xTotalPrice) +'" style="color:#fff;background:#ff0000;"></div></div>';  
  //} else {
    str += '<div class="box-price"><div style="font-size:12px;font-weight:600;">จำนวนเงินที่สั่ง</div><input type="text" value="'+ numberWithCommas(xTotalPrice) +'" style="color:#fff;background:#0056ff;"></div></div>';  
  //}
  if(xBalance>=0) {
    str += '<div class="box-price"><div style="font-size:12px;font-weight:600;">ยอดงบคงเหลือ</div><input type="text" value="'+ numberWithCommas(xBalance) +'" style="color:#fff;background:#13c33b;"></div></div>';
  } else {
    str += '<div class="box-price"><div style="font-size:12px;font-weight:600;">ยอดงบคงเหลือ</div><input type="text" value="'+ numberWithCommas(xBalance) +'" style="color:#fff;background:#ff0000;"></div></div>';
  }
  str += '</div>';
  str += '<div class="clr"></div>';
  var xCalAll = xBMAllocated-xTotalPrice;
  if(xBMAllocated-xTotalPrice>0) {
    str += '<div id="ShowSaveData" style="display:block;margin-bottom: 20px;">';
    if(xBMStatus==0 || xBMStatus==1) {
      if(xTotalUnitPrice!=0) {
        if(xTotalUnitPrice!=0) {
          str += '<div class="btn-z3" onclick="DeleteAllOrder(\''+ gID +'\')" style="margin:10px 10px 10px auto;min-width:100px;">ยกเลิก<br>รายการสั่งซื้อ</div>';
        }
        str += '<div class="btn-z1" onclick="SaveOrder(\''+ gID +'\')" style="margin:10px 10px 10px auto;min-width:100px;">บันทึกดร๊าฟ<br>รายการสั่งซื้อ</div>';
      } else {
        str += '<div class="btn-z0" style="margin:10px 10px 20px auto;min-width:100px;">กรุณาสั่ง<br>ของขวัญปีใหม่</div>';
        str += '<div class="btn-z1" onclick="GotoOrder()" style="margin:10px 10px 20px auto;min-width:100px;">กลับไป<br>หน้าแรก</div>';
        //str += '<div class="btn-z0" style="margin:20px 10px 20px auto;min-width:100px;" onclick="GotoOrder">กลับไป<br>หน้าแรก</div>';
      }
    } else if(xBMStatus==2) {
      str += '<div class="btn-z0" onclick="ViewOrder(\''+ gID +'\')" style="margin:10px 10px 10px auto;min-width:100px;">ดูรายละเอียด<br>รายการสั่งซื้อ</div>';
      str += '<div class="btn-z1" onclick="GotoOrder()" style="margin:10px 10px 20px auto;min-width:100px;">กลับไป<br>หน้าแรก</div>';

      str += '<div style="font-weight:600;">รายการอยู่ระหว่างการขออนุมัติจากโซน<br></div>'
    } else if(xBMStatus==3) {
      if(xTotalUnitPrice!=0) {
        str += '<div class="btn-z1" onclick="SaveOrder(\''+ gID +'\')" style="margin:10px 10px 10px auto;min-width:100px;">บันทึกดร๊าฟ<br>รายการสั่งซื้อ</div>';
        str += '<div style="font-weight:600; color:#ff0000;line-height:1.2;"><font color="#000000">โซนแจ้งทำการทบทวนการสั่งจองใหม่อีกครั้ง</font><br>'+zZoneMemoToBM+'</div>'
      }
    } else if(xBMStatus==9) {
      str += '<div class="btn-z9" onclick="ViewOrder(\''+ gID +'\')" style="margin:10px 10px 10px auto;min-width:100px;">ดูรายการสั่งซื้อ<br>ของขวัญปีใหม่</div>';
      str += '<div style="font-weight:600; color:#0056ff;">รายการของท่านได้รับการอนุมัติจากโซน เรียบร้อยแล้ว<br></div>'
    } else {
      str += '<div class="btn-z0" onclick="ViewOrder(\''+ gID +'\')" style="margin:10px 10px 10px auto;min-width:100px;">ดูรายละเอียด<br>รายการสั่งซื้อ</div>';
      str += '<div style="font-weight:600;">รายการอยู่ระหว่างการขออนุมัติการสั่งจองของขวัญปีใหม่<br></div>'
    }
    //str += '<div class="btn-z3" onclick=location.href="home.html" style="margin:20px auto 20px auto;">ไม่บันทึก<br>รายการ</div>';
    str += '</div>';
  } else {
    alert("ขณะนี้คุณได้ทำคำสั่งซื้อของขวัญปีใหม่\nจากงบประมาณที่ได้รับ "+ numberWithCommas(xBMAllocated) +" บาท\nยอดสั่งของขวัญของคุณ "+ numberWithCommas(xTotalPrice) +" บาท\nคุณสั่งเกินไปแล้ว "+ numberWithCommas(xCalAll) +" บาท\nระบบจะไม่อนุญาตให้บันทึกรายการสั่งจอง");
    str += '<div class="btn-t2" onclick=location.href="home.html" type="submit" style="margin-top:20px;">ไม่บันทึกรายการ</div>';
  }
  str += '<hr><div style="margin-top:-10px;text-align:left;padding-bottom: 10px;line-height:1.3; padding-left:10px;">BM : <b>'+ xBMName +'</b><br>Branch : <b>'+ xBranchName +'</b></div>';
  $("#TotalGift").html(str);
}


function DisplayGift(xID) {
  var str = "";
  dbGiftStock.where(firebase.firestore.FieldPath.documentId(), "==", xID)
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      str += '<center><div class="btn-t3" style="margin-top:25px;"><b>รายละเอียดของขวัญปีใหม่</b></div>';
      str += '<div><img src="'+ doc.data().StockImg +'" style="width:100%;margin-top:18px;margin-bottom: 10px;"></div></center>';
      str += '<div style="font-weight:600;">'+ doc.data().StockName +'</div>';
      str += '<div style="font-weight:400; text-align:left; padding-top:10px;">'+ doc.data().StockDetail +'</div>';
      str += '<div style="font-weight:400;padding-top:10px;">ราคาขายต่อชิ้น <b>'+ doc.data().PointRedeem +' บาท</b></div>';
      str += '';
      str += '';
      str += '<div class="clr"></div>';
      str += '<div class="btn-t2" onclick="CloseAll()" style="margin:15px auto 25px auto;">ปิดหน้าต่างนี้</div>';
    });    
    $("#DisplayGift").html(str);
  });
  document.getElementById('id03').style.display='block';
}


function DeleteAllOrder(gid) {
  //alert(gID);

  dbGiftOrder.where('RefID','==',gid)
  .get().then((snapshot)=> {
  snapshot.forEach(doc=> {
      dbGiftOrder.doc().delete();
      DeleteRefID(doc.id);
    });
  

    console.log("gID="+gID);
    var Timedelay = 1000; //1 second
    setTimeout(function() {    
      dbNewyearData.doc(gID).update({
        BMStatus : 0,
        TotalOrders : 0,
        UseBudget : 0,
        BMBalance : 0
      });
    }, Timedelay);


    var delayInMilliseconds = 2000; //1 second
    setTimeout(function() {    
      alert("ระบบได้ทำการลบรายการการสั่งจองของขวัญของคุณเรียบร้อยแล้ว");
      location.href = "ordergift.html?gid="+gID;
    }, delayInMilliseconds);
  });
}


function DeleteRefID(gid) {
  dbGiftOrder.doc(gid).delete();
  console.log(gid);
}


function ViewOrder(gid) {
  //alert("View "+gid); ShowNav
  var str = "";
  var xSumItem = 0;
  var xSumMoney = 0;
  str += '<center><div class="btn-t22a" style="margin:30px auto 20px auto;"><b>รายการสั่งซื้อของขวัญปีใหม่ของสาขา</b></div></center>';
  str += '<div style="line-height:1.3; text-align:left; font-weight:600;">สาขา : '+ xBranchName +'<br>BM : '+ xBMName +'</div>';
  str += '<table class="table table-bordered" class="font13" style="background-color: #fff;margin-top:10px;">';
  str += '<thead><tr style="text-align: center;background-color: #93a3c1;">';
  str += '<th scope="col">รายการ</th><th scope="col">จำนวน</th><th scope="col">ราคา</th></tr></thead><tbody>';
  dbGiftOrder.where('RefID','==',gid)
  .orderBy('StockName','asc')
  .get().then((snapshot)=> {
  snapshot.forEach(doc=> {
      xSumItem = xSumItem + doc.data().OrderGift;
      xSumMoney = xSumMoney + (doc.data().OrderGift * doc.data().PointRedeem);
      str += '<tr><th scope="row" style="text-align: left;">'+ doc.data().StockName +'</th>';
      str += '<td style="text-align: right; font-weight: 600;">'+ doc.data().OrderGift +'</td>';
      str += '<td style="text-align: right; font-weight: 600;">'+ numberWithCommas(doc.data().OrderGift * doc.data().PointRedeem) +'</td></tr>';
    });
    str += '<tr><th scope="row" style="text-align: left;background:#73a0f4;">สรุปรายการสั่งซื้อ</th>';
    str += '<td style="text-align: right; font-weight: 600;background:#73a0f4;">'+ addCommas(xSumItem) +'</td>';
    str += '<td style="text-align: right; font-weight: 600;background:#73a0f4;">'+ numberWithCommas(xSumMoney) +'</td></tr>';
    str += '<tr><td style="text-align: center;font-weight: 600;background:#f1f1f1;">งบประมาณที่ได้รับ</td><td colspan="2" style="text-align: right;font-weight: 600;background:#e831e8;">'+ numberWithCommas(xBMAllocated) +'</td></tr>';
    str += '<tr><td style="text-align: center;font-weight: 600;background:#f1f1f1;">ยอดรวมการสั่งซื้อ</td><td colspan="2" style="text-align: right;font-weight: 600;background:#f68b1f;">'+ numberWithCommas(xSumMoney) +'</td></tr>';
    str += '<tr><td style="text-align: center;font-weight: 600;background:#f1f1f1;">งบประมาณคงเหลือ</td><td colspan="2" style="text-align: right;font-weight: 600;background:#0056ff;">'+ numberWithCommas(xBMAllocated-xSumMoney) +'</td></tr>';
    str += '</tbody></table>';
    str += '<div class="btn-z0" onclick="CloseAll()" style="margin:20px 10px 20px auto;">ปิดหน้าต่าง<br>รายการนี้</div>';
    $("#DisplayGift").html(str);
  });
  document.getElementById('id03').style.display='block';
}


function SaveOrder() {
  LoadDetail();
  var h = 0;
  var j = 0;
  var yRefGiftID = "";
  var yCheckFound = 0;
  var EidOrder = "";
  console.log(xMaxGift);
  for (let h = 0; h < (xMaxGift); h++) { 
    var CalTotalGift = document.getElementById("OrderGiftID"+h).value*document.getElementById("UnitPrice"+h).value;
    SaveGift(document.getElementById("OrderGiftRefID"+h).value, document.getElementById("UnitPrice"+h).value, document.getElementById("OrderGiftID"+h).value, CalTotalGift, document.getElementById("NameGift"+h).value);
  }
}


var xSumMoney = 0;
function SaveGift(GiftID,GiftPrice,GiftOrder,GiftTotal,NameGift) {
  document.getElementById('ShowNav').style.display='none';
  LoadDetail();
  xSumMoney = 0;
  var str = "";
  var EidOrder = "";
  var xCheck = 0;
  xSumMoney = xSumMoney + xTotalPrice;
  dbGiftOrder.where('RefID','==',gID)
  .where('RefGift','==',GiftID)
  .get().then((snapshot)=> {
  snapshot.forEach(doc=> {
      EidOrder = doc.id;
      xCheck = 1;
    });
    if(GiftOrder==0) {
      //alert("GiftOrder="+GiftOrder);
      dbGiftOrder.doc(EidOrder).delete();
    } else {
      if(xCheck == 1) {
        //var xSumPrice = parseFloat(GiftOrder) * parseFloat(GiftPrice);
        var xSumPrice = parseFloat(GiftOrder * GiftPrice);
        //console.log("Old Data "+GiftID);
        dbGiftOrder.doc(EidOrder).update({
          OrderGift : parseFloat(GiftOrder),
          //OrderPrice : numberWithCommas(parseFloat(xSumPrice)),
          OrderPrice : parseFloat(GiftOrder*GiftPrice),
          //OrderPrice : parseFloat(xSumPrice).toFixed(2),
          //OrderPrice : parseFloat(numberWithCommas(GiftOrder*GiftPrice)),
          //OrderPrice : parseFloat(numberWithCommas(GiftOrder*GiftPrice)),
          //OrderPrice : parseFloat(numberWithCommas(GiftTotal)),
          PointRedeem : parseFloat(GiftPrice),
        });
      } else {
        //console.log("New Data "+GiftID);
        dbGiftOrder.add({
          RefID : gID,
          RefGift : GiftID,
          EmpID : xBMEmpID,
          EmpName : xBMName,
          EmpBR : xBranchName,
          EmpZone : xZone,
          EmpRH : xRH,
          OrderGift : parseFloat(GiftOrder),
          //OrderPrice : parseFloat(numberWithCommas(GiftTotal)),
          //OrderPrice : parseFloat(numberWithCommas(GiftOrder*GiftPrice)),
          OrderPrice : parseFloat(GiftOrder*GiftPrice),
          //OrderPrice : numberWithCommas(parseFloat(xSumPrice)),
          PointRedeem : parseFloat(GiftPrice),
          StockName : NameGift
        });
      }

    }
  });
  var h = 0;
  var m = 0;
  str += '<div class="btn-t22a" style="margin-top:15px;">บันทึกการสั่งจองของขวัญปีใหม่</div>';
  str += '<table class="table table-bordered" class="font13" style="background-color: #fff; margin-top:20px;">';
  str += '<thead><tr style="text-align: center;background-color: #93a3c1;">';
  str += '<th scope="col">รายการ</th><th scope="col">จำนวน</th><th scope="col">ราคา</th></tr></thead><tbody>';
  for (let h = 0; h < (xMaxGift); h++) { 
    if(document.getElementById("OrderGiftID"+h).value!=0) {
      str += '<tr><th scope="row" style="text-align: left;">'+ document.getElementById("NameGift"+h).value +'</th>';
      str += '<td style="text-align: right; font-weight: 600;">'+ document.getElementById("OrderGiftID"+h).value +'</td>';
      str += '<td style="text-align: right; font-weight: 600;">'+ numberWithCommas(document.getElementById("OrderGiftID"+h).value * document.getElementById("UnitPrice"+h).value) +'</td></tr>';
      m++;
    }
  }
  str += '<tr><td style="text-align: center;font-weight: 600;background:#f1f1f1;">รวมยอดการสั่งจองของขวัญ</td><td colspan="2" style="text-align: right;font-weight: 600;background:#31e85b;">'+ numberWithCommas(xSumMoney) +'</td></tr>';
  str += '<tr><td style="text-align: center;font-weight: 600;background:#f1f1f1;">งบประมาณที่ได้รับ</td><td colspan="2" style="text-align: right;font-weight: 600;background:#f68b1f;">'+ numberWithCommas(xBMAllocated) +'</td></tr>';
  str += '<tr><td style="text-align: center;font-weight: 600;background:#f1f1f1;">งบประมาณคงเหลือ</td><td colspan="2" style="text-align: right;font-weight: 600;background:#0056ff;">'+ numberWithCommas(xBMAllocated-xSumMoney) +'</td></tr></tbody></table>';
  str += '<div class="btn-t22a" style="margin-top:15px;">รายละเอียดเพิ่มเติม</div><div class="clr"></div>';
  str += '<div style="text-align:left; margin:20px 0 2px 5px;">ที่ตั้งสาขา-ที่จัดส่งของขวัญ</div><center><textarea id="txtBM_Address" name="BM_Address" style="width:98%; height:80px;text-align:left;font-weight:600; color:#000;">'+ zBM_Address +'</textarea></center></div>';
  str += '<div style="text-align:left; margin:10px 0 2px 5px;">โทรศัพท์ผู้จัดการสาขา</div><input type="text" id="txtBM_Phone" value="'+ zBM_Phone +'" style="text-align:left;"></div>';
  str += '<div style="text-align:left; margin:10px 0 2px 5px;">ผู้รับสินค้า 1 (กรอกรหัสพนักงาน)</div><input type="text" id="txtEmpID_Staff1" value="'+ zEmpID_Staff1 +'" style="text-align:left;"></div>';
  str += '<div style="text-align:left; margin:10px 0 2px 5px;">ผู้รับสินค้า 1 (กรอกชื่อ-นามสกุล)</div><input type="text" id="txtEmpName_Staff1" value="'+ zEmpName_Staff1 +'" style="text-align:left;"></div>';
  str += '<div style="text-align:left; margin:10px 0 2px 5px;">ผู้รับสินค้า 1 (กรอกหมายเลขโทรศัพท์)</div><input type="text" id="txtPhone_Staff1" value="'+ zPhone_Staff1 +'" style="text-align:left;"></div>';
  str += '<div style="text-align:left; margin:10px 0 2px 5px;">ผู้รับสินค้า 2 (กรอกรหัสพนักงาน)</div><input type="text" id="txtEmpID_Staff2" value="'+ zEmpID_Staff2 +'" style="text-align:left;"></div>';
  str += '<div style="text-align:left; margin:10px 0 2px 5px;">ผู้รับสินค้า 2 (กรอกชื่อ-นามสกุล)</div><input type="text" id="txtEmpName_Staff2" value="'+ zEmpName_Staff2 +'" style="text-align:left;"></div>';
  str += '<div style="text-align:left; margin:10px 0 2px 5px;">ผู้รับสินค้า 2 (กรอกหมายเลขโทรศัพท์)</div><input type="text" id="txtPhone_Staff2" value="'+ zPhone_Staff2 +'" style="text-align:left;"></div>';
  str += '<div class="btn-z1" onclick="SaveDetail(\''+ gID +'\')" style="margin:20px 10px 20px auto;">บันทึกดร๊าฟ<br>ก่อนส่งโซน</div>';
  str += '<div class="btn-z0" onclick="CloseAll()" style="margin:20px 10px 20px auto;">ทำการแก้ไข<br>ใหม่อีกครั้ง</div>';
  str += '<div class="clr"></div>'
  str += '<div class="btn-z3" onclick="SaveToZone(\''+ gID +'\')" style="width:56%;margin:-10px auto 20px auto;display:none" id="idSendZoneApprove">ส่งคำขอ<br>ให้โซนอนุมัติ</div>';
  $("#DisplaySaveGift").html(str);
  $("#idSendZoneApprove").addClass("disabledbutton");
  var xBMmemo = 'บันทึกรายการแก้ไขรายการ ' + dateString + '<br>';

  var delayInMilliseconds = 1000; //1 second
  setTimeout(function() {
    dbNewyearData.doc(gID).update({
      BMStatus : 1,
      BMBalance : parseFloat(xBMAllocated-xSumMoney),
      TotalOrders : parseFloat(m),
      TotalOrders : parseFloat(xTotalUnitPrice),
      UseBudget : parseFloat(xTotalPrice),
      BM_Memo : xBMmemo
    });
  }, delayInMilliseconds);
  document.getElementById('id01').style.display='block';
}


function SaveToZone() {
  var h = 0;
  var m = 0;
  dbNewyearData.doc(gID).update({
    BMStatus : 2
    //BMBalance : parseFloat(xBMAllocated-xSumMoney),
    //TotalOrders : parseFloat(m),
    //TotalOrders : parseFloat(xTotalUnitPrice),
    //UseBudget : parseFloat(xTotalPrice)
  });
  str += '<div class="btn-t22a" style="margin-top:15px;">นำส่งรายการสั่งซื้อให้โซนอนุมัติ</div>';
  str += '<table class="table table-bordered" class="font13" style="background-color: #fff; margin-top:20px;">';
  str += '<thead><tr style="text-align: center;background-color: #93a3c1;">';
  str += '<th scope="col">รายการ</th><th scope="col">จำนวน</th><th scope="col">ราคา</th></tr></thead><tbody>';
  for (let h = 0; h < (xMaxGift); h++) { 
    if(document.getElementById("OrderGiftID"+h).value!=0) {
      str += '<tr><th scope="row" style="text-align: left;">'+ document.getElementById("NameGift"+h).value +'</th>';
      str += '<td style="text-align: right; font-weight: 600;">'+ document.getElementById("OrderGiftID"+h).value +'</td>';
      str += '<td style="text-align: right; font-weight: 600;">'+ numberWithCommas(document.getElementById("OrderGiftID"+h).value * document.getElementById("UnitPrice"+h).value) +'</td></tr>';
      m++;
    }
  }
  str += '<tr><td style="text-align: center;font-weight: 600;background:#f1f1f1;">รวมทั้งหมด</td><td colspan="2" style="text-align: right;font-weight: 600;background:#31e85b;">'+ numberWithCommas(xSumMoney) +'</td></tr>';
  str += '<tr><td style="text-align: center;font-weight: 600;background:#f1f1f1;">งบประมาณที่ได้รับ</td><td colspan="2" style="text-align: right;font-weight: 600;background:#f68b1f;">'+ numberWithCommas(xBMAllocated) +'</td></tr>';
  str += '<tr><td style="text-align: center;font-weight: 600;background:#f1f1f1;">งบประมาณคงเหลือ</td><td colspan="2" style="text-align: right;font-weight: 600;background:#0056ff;">'+ numberWithCommas(xBMAllocated-xSumMoney) +'</td></tr></tbody></table>';
  str += '<div class="txtmsg">ขณะนี้รายการการจัดซื้อของขวัญของสาขา อยู่ระหว่างการอนุมัติโดยโซนที่ดูแลสาขาของท่าน กรุณารอการอนุมัติ</div>'
  //str += '<div class="txtmsg">หากท่านได้ทำการสั่งจองเรียบร้อยแล้ว ให้ทำการกดปุ่ม<br><u>ส่งคำขอให้โซน</u> เพื่อทำการอนุมัติรายการต่อไป<br>หลังการกดส่งคำขออนุมัติแล้ว ท่านจะไม่สามารถ<br>ทำการแก้ไขรายการได้อีก</div>'
  str += '<center><div class="btn-t1" onclick="GotoOrder()">ปิดหน้าต่างนี้</div></center>';
  $("#DisplaySaveToZone").html(str);
  document.getElementById('id02').style.display='block';
}


function GotoOrder() {
  //alert(gid+"--"+gStatus);home.html
  //location.href = "ordergift.html?gid="+gID;
  location.href = "home.html";
}


function SaveDetail() {
  var dBM_Address = document.getElementById("txtBM_Address").value;
  var dBM_Phone = document.getElementById("txtBM_Phone").value;
  var dEmpID_Staff1 = document.getElementById("txtEmpID_Staff1").value;
  var dEmpName_Staff1 = document.getElementById("txtEmpName_Staff1").value;
  var dPhone_Staff1 = document.getElementById("txtPhone_Staff1").value;
  var dEmpID_Staff2 = document.getElementById("txtEmpID_Staff2").value;
  var dEmpName_Staff2 = document.getElementById("txtEmpName_Staff2").value;
  var dPhone_Staff2 = document.getElementById("txtPhone_Staff2").value;
  if(dBM_Address=="" || dBM_Phone=="" || dEmpID_Staff1=="" || dEmpName_Staff1=="" || dPhone_Staff1=="" || dEmpID_Staff2=="" || dEmpName_Staff2=="" || dPhone_Staff2=="" ) {
    alert("คุณยังกรอกข้อมูลไม่ครบถ้วน");
  } else {
    dbNewyearData.doc(gID).update({
      BM_Address : document.getElementById("txtBM_Address").value,
      BM_Phone : document.getElementById("txtBM_Phone").value,
      EmpID_Staff1 : document.getElementById("txtEmpID_Staff1").value,
      EmpName_Staff1 : document.getElementById("txtEmpName_Staff1").value,
      Phone_Staff1 : document.getElementById("txtPhone_Staff1").value,
      EmpID_Staff2 : document.getElementById("txtEmpID_Staff2").value,
      EmpName_Staff2 : document.getElementById("txtEmpName_Staff2").value,
      Phone_Staff2 : document.getElementById("txtPhone_Staff2").value
    });
    alert("ระบบได้ทำการบันทึกรายการนี้เรียบร้อยแล้ว หากไม่มีการแก้ไขรายการให้ทำการกดปุ่ม ส่งคำขอให้โซนอนุมัติ ซึ่งจะมีผลให้สาขาไม่สามารถทำการแก้ไขรายการได้แล้ว")
    LoadDetail();
    //$('#idSendZoneApprove').removeAttr('disabled');
    document.getElementById('idSendZoneApprove').style.display='block';
  }
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

function numberWithCommas(num) {
  var valueString=num; //can be 1500.0 or 1500.00 
  var amount=parseFloat(valueString).toFixed(2);
  return formattedString= amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function CloseAll() {
  document.getElementById('ShowNav').style.display='block';
  document.getElementById('id01').style.display='none';
  document.getElementById('id02').style.display='none';
  document.getElementById('id03').style.display='none';
}












