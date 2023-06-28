var dateString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear()+543;
today = dd + '/' + mm + '/' + yyyy;
var cleararray = "";
var xCodeDate = "NewYearGift2024";
var CheckOpen1= 0;
var CheckOpen2= 0;
var CheckOpen3= 0;


$(document).ready(function () {
  var str ="";
  if(sessionStorage.getItem("EmpID_Newyear")==null) { location.href = "index.html"; }
  Connect_DB();
  dbNewyearMember = firebase.firestore().collection("Newyear2024_member");
  dbNewyearData = firebase.firestore().collection("Newyear2024_data");
  dbNewyearLog = firebase.firestore().collection("Newyear2024_log");
  dbGiftStock = firebase.firestore().collection("Newyear2024_gift");
  dbGiftOpen = firebase.firestore().collection("TNIdate");
  dbGiftOrder = firebase.firestore().collection("Newyear2024_order");
  CheckGiftOpen();
});


function CheckGiftOpen() {
  var str = "";
  var str1 = "";
  str1 += '<div style="margin:-10px auto 10px auto; width:96%;">';
  dbGiftOpen.where('CodeName','==',xCodeDate)
  .limit(1)
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      if(doc.data().OpenZone==1) {
        CheckOpen1 = 1;
        str1 += '<div class="box3select"><div><img src="./img/icon-01.png" style="width:70%;"></div><div class="box3-txt">โซนอนุมัติ<br>งบประมาณ</div></div>';
        DisplayGroup_1();
      } else {
        str1 += '<div class="box3 colorgray"><div><img src="./img/icon-01.png" style="width:70%;"></div><div class="box3-txt">โซนอนุมัติ<br>งบประมาณ</div></div>';
      }
      if(doc.data().OpenBM==1) {
        CheckOpen2 = 1;
        DisplayGroup_2();
        str1 += '<div class="box3select"><div><img src="./img/icon-02.png" style="width:70%;"></div><div class="box3-txt">สาขาสั่งจอง<br>ของขวัญ</div></div>';
      } else {
        str1 += '<div class="box3 colorgray"><div><img src="./img/icon-02.png" style="width:70%;"></div><div class="box3-txt">สาขาสั่งจอง<br>ของขวัญ</div></div>';
      }
      if(doc.data().ConfirmZone==1) {
      console.log("Found3");
        CheckOpen3 = 1;
        str1 += '<div class="box3select"><div><img src="./img/icon-03.png" style="width:70%;"></div><div class="box3-txt">โซนอนุมัติ<br>การสั่งจอง</div></div>';
        DisplayGroup_3();
      } else {
        str1 += '<div class="box3 colorgray"><div><img src="./img/icon-03.png" style="width:70%;"></div><div class="box3-txt">โซนอนุมัติ<br>การสั่งจอง</div></div>';
      }
    });
    ShowProfile();
    str1 += '</div>';
    $("#DisplayMenu").html(str1);
  });

}


function CheckRedeemPoint() {
  var xPointRedeem = 0;
  var xItemRedeem = 0;
  dbPRURedeemPoint.where('EmpID','==',parseFloat(sessionStorage.getItem("EmpID_Newyear")))
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      xPointRedeem = xPointRedeem + parseFloat(doc.data().TotalPointRedeem);
      xItemRedeem = xItemRedeem + parseFloat(doc.data().TotalItemRedeem);
    });
    sessionStorage.setItem("TotalPointRedeem", xPointRedeem);
    sessionStorage.setItem("TotalItemRedeem", xItemRedeem);
  });
}


function DisplayGroup_1() {
  var str = "";
  var i = 0;
  var xStatus = "";
  var sTotalBudget = 0;
  var sTotalZone = 0;
  var sTotalBalance = 0;
  str += '<center><div class="btn-t22a"><b>โซนอนุมัติงบประมาณของสาขาในสังกัด</b></div></center>';
  //str += '<div class="font13" style="margin-bottom: 5px;"><b>โซนอนุมัติงบประมาณของสาขาในสังกัด</b></div>';
  str += '<table class="table table-bordered" class="font13" style="background-color: #fff;margin-top:20px;">';
  str += '<thead><tr style="text-align: center;background-color: #93a3c1;">';
  str += '<th scope="col">No.</th><th scope="col">สาขา</th><th scope="col">รายการ</th></tr></thead><tbody>';
  //dbNewyearData.where('BMEmpID','==',parseFloat(sessionStorage.getItem("EmpID_Newyear")))
  dbNewyearData.where('EmpID_Zone','==',parseFloat(sessionStorage.getItem("EmpID_Newyear")))
  //.where('GroupTeam','==',1)
  .orderBy('BranchID','asc')
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      str += '<tr><th scope="row" style="text-align: center;">'+ (i+1) +'</th>';
      str += '<td style="text-align: left; line-height: 1.2;"><font color="#0056ff"><b>'+ doc.data().BranchName +'</b><br>โซน : '+ doc.data().EmpZone +' | '+ doc.data().EmpRH +'</font>';
      str += '<br>งบของขวัญสาขา = <b>'+ addCommas(doc.data().BMBudget) +' บาท</b><br>ยอดจัดสรรใหม่ = <b>'+ addCommas(doc.data().BMAllocated) +' บาท</b></td>';
      if(doc.data().Zone_Approve==0) {
        str += '<td style="text-align: center;"><div class="btn-z0" onclick="OpenBudgetBM(\''+ doc.id +'\')">รอยืนยัน<br>งบของขวัญ</div></td></tr>';
      } else {
        str += '<td style="text-align: center;"><div class="btn-z9" onclick="OpenBudgetBM(\''+ doc.id +'\')">อนุมัติ<br>รายการ</div></td></tr>';
      }
      sTotalBudget +=  doc.data().BMBudget ;
      sTotalZone +=  doc.data().BMAllocated ;
      i++;
    });
    str += '</tbody></table></div>';
    str += '<div class="clr"></div>';
    sTotalBalance = sTotalBudget - sTotalZone ;
    if(sTotalBalance>=0) {
      str += '<div>จำนวนสาขาในสังกัดโซน <b>'+ i +' สาขา</b><br>ยอดรวมงบของโซน <b>'+ addCommas(sTotalBudget) +' บาท</b><br>ยอดรวมงบสาขา <b>'+ addCommas(sTotalZone) +' บาท</b> <font color="#13b510"><b>(มีส่วนต่างอีก '+ addCommas(sTotalBalance) +' บาท)</b></font></div>';
    } else {
      str += '<div>จำนวนสาขาในสังกัดโซน <b>'+ i +' สาขา</b><br>ยอดรวมงบของโซน <b>'+ addCommas(sTotalBudget) +' บาท</b><br>ยอดรวมงบสาขา <b>'+ addCommas(sTotalZone) +' บาท</b> <font color="#c12828"><b>(เกินงบประมาณไป '+ addCommas(sTotalBalance) +' บาท)</b></font></div>';
    }
    str += '<div class="clr" style="height:30px;"></div>';
    console.log(i+"==="+sTotalZone);
    $("#DisplayGroup1").html(str);
  });
}


function OpenBudgetBM(gid) {
  var str = "";
  dbNewyearData.where(firebase.firestore.FieldPath.documentId(), "==", gid)
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      EidNews = doc.id;
      str += '<div>';
      str += '<div style="width:100%;margin:auto;text-align: left;">';
      str += '<div class="clr" style="height:10px;"></div>';
      str += '<center>';
      str += '<div class="redeem-txt4">สาขาในสังกัดโซน</div>';
      str += '<div class="redeem-txt6"><textarea id="idNewsDetail" class="text-area" style="height:76px;background-color:#cfd8dc;padding-top:10px;font-weight:600;" readonly>BM | '+ doc.data().BMName +'\n'+ doc.data().BranchName +' ('+ doc.data().BranchID +')\nโซน '+ doc.data().EmpZone +' | สังกัด '+ doc.data().EmpRH +'</textarea></div>';
      str += '<div class="clr"></div>';
      str += '<div class="redeem-txt4">ยอดงบประมาณของสาขา</div>';
      str += '<div class="redeem-txt6"><input type="text" value="'+ addCommas(doc.data().BMBudget) +'" style="width:50%;text-align:center;background-color:#cfd8dc;" readonly></div>';
      str += '<div class="clr"></div>';
      str += '<div class="redeem-txt4">ยอดงบประมาณที่โซนจัดสรรให้ใหม่<br><font color="#ff0000"><b>แก้ไขตัวเลขในช่องด้านล่างนี้</b></font></div>';
      if(doc.data().BMAllocated==0) {
        str += '<div class="redeem-txt6"><input type="text" value="'+ doc.data().BMBudget +'" id="idBMAllocated" style="width:50%;text-align:center;font-size:16px !important;"></div>';        
      } else {
        str += '<div class="redeem-txt6"><input type="text" value="'+ doc.data().BMAllocated +'" id="idBMAllocated" style="width:50%;text-align:center;font-size:16px !important;"></div>';        
      }
      str += '<div class="clr"></div>';
      str += '<div style="margin-top:20px;">';
      if(doc.data().Zone_Approve==0) {
        str += '<div class="btn-z9" onclick="SaveBMAllocated(\''+ gid +'\',\''+ doc.data().Zone_Memo +'\')">อนุมัติ<br>งบประมาณ</div>';
      } else {
        str += '<div class="btn-z3" onclick="CancelBMAllocated(\''+ gid +'\')">ยกเลิก<br>การอนุมัติ</div>';
      }
      str += '<div class="btn-z0" onclick="CloseAll()">ปิด<br>หน้าต่าง</div>';
      str += '</div>';
      str += '</center>';
      str += '<div class="clr" style="height:30px;"></div>';
    });
    $("#DisplayBMAllocated").html(str);
  });
  document.getElementById("id01").style.display = "block";
}


function CancelBMAllocated(gid) {
  dbNewyearData.doc(gid).update({
    BMStatus : 0,
    Zone_Approve : 0
  });

  var delayInMilliseconds = 1000; //1 second
  setTimeout(function() {
  DisplayGroup_1();
  DisplayGroup_2();
  DisplayGroup_3();
  document.getElementById('id01').style.display='none';
  }, delayInMilliseconds);
}


function SaveBMAllocated(gid,xmemo) {
  NewDate();
  var TimeStampDate = Math.round(Date.now() / 1000);
  var sidBMAllocated = document.getElementById("idBMAllocated").value;
  var xZone_Memo = xmemo+"โซนอนุมัติงบของขวัญ : "+parseFloat(sidBMAllocated)+" บาท | "+ dateString +"<br>" ;
  dbNewyearData.doc(gid).update({
    BMStatus : 0,
    Zone_Approve : 1,
    //BMAllocated : sidBMAllocated,
    BMAllocated : parseFloat(sidBMAllocated),
    Zone_Memo : xZone_Memo,
    Date_Approve : dateString
  });
  var delayInMilliseconds = 1000; //1 second
  setTimeout(function() {
  DisplayGroup_1();
  DisplayGroup_2();
  DisplayGroup_3();
  document.getElementById('id01').style.display='none';
  }, delayInMilliseconds);

}



function DisplayGroup_2() {
  var str = "";
  var i = 0;
  var xStatus = "";
  var xMsg = "";
  var xMsgZone = "";
  str += '<center><div class="btn-t22a"><b>สาขาสั่งจองของขวัญปีใหม่</b></div></center>';
  //str += '<div class="font13" style="margin-top:40px; margin-bottom: 5px;"><b>สาขาสั่งจองของขวัญปีใหม่ ภายใต้งบประมาณที่ได้รับ</b></div>';
  str += '<table class="table table-bordered" class="font13" style="background-color: #fff;margin-top:20px;">';
  str += '<thead><tr style="text-align: center;background-color: #93a3c1;">';
  str += '<th scope="col">No.</th><th scope="col">สาขา</th><th scope="col">รายการ</th></tr></thead><tbody>';
  dbNewyearData.where('BMEmpID','==',parseFloat(sessionStorage.getItem("EmpID_Newyear")))
  .where('GroupTeam','==',2)
  .orderBy('BranchID','asc')
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      if(doc.data().Zone_Approve!=0) { 
        xMsg = "";
        if(doc.data().BMStatus==0) { 
          xMsg = "คลิกเพื่อ<br>สั่งของขวัญ";
          xStatus = "<font color='#555555'><b>สาขาคลิกเพื่อสั่งจองของขวัญ</b></font>";
        } else if(doc.data().BMStatus==1) {
          xMsg = "อยู่ระหว่าง<br>การสั่งจอง";
          xStatus = "<font color='#f68b1f'><b>อยู่ระหว่างการสั่งจอง</b></font>";
        } else if(doc.data().BMStatus==2) {
          xMsg = "ส่งโซนเพื่อ<br>ขออนุมัติ";
          xStatus = "<font color='#0056ff'><b>ส่งโซนเพื่อขออนุมัติ</b></font>";
        } else if(doc.data().BMStatus==3) {
          xMsg = "โซนแจ้ง<br>ทบทวน";
          xStatus = "<font color='#ff0000'><b>โซนแจ้งทบทวนการจัดซื้อใหม่</b></font>";
        } else if(doc.data().BMStatus==8) {
          xMsg = "โซนแจ้ง<br>ยกเลิก";
          xStatus = "<font color='#ff0000'><b>โซนแจ้งขอยกเลิกการจอง</b></font>";
        } else if(doc.data().BMStatus==9) {
          xMsg = "โซนอนุมัติ<br>รายการแล้ว";
          xStatus = "<font color='#28c92a'><b>โซนอนุมัติรายการแล้ว</b></font>";
        }
        str += '<tr><th scope="row" style="text-align: center;">'+ (i+1) +'</th>';
        //str += '<td style="text-align: left; line-height: 1.2;"><font color="#0056ff"><b>'+ doc.data().BranchName +'</b> ['+ doc.data().BMStatus +']</font>';
        str += '<td style="text-align: left; line-height: 1.2;"><font color="#0056ff"><b>'+ doc.data().BranchName +'</b></font>';
        if(doc.data().BMStatus==0) {
          str += '<br>งบประมาณที่ได้รับ = <b>'+ numberWithCommas(doc.data().BMAllocated) +' บาท</b><br>สถานะ : '+ xStatus +'</td>';
        } else if(doc.data().BMStatus==1 || doc.data().BMStatus==3) {
          str += '<br>ยอดการสั่งซื้อ = <b>'+ numberWithCommas(doc.data().UseBudget) +' บาท</b><br>งบประมาณคงเหลือ = <b>'+ numberWithCommas(doc.data().BMBalance) +' บาท</b> <br>สถานะ : '+ xStatus +'</td>';
          //str += '<br>งบประมาณที่ได้รับ = <b>'+ addCommas(doc.data().BMAllocated) +' บาท</b><br>สถานะ : '+ xStatus +'</td>';
        } else if(doc.data().BMStatus==2) {
          str += '<br>ยอดการสั่งซื้อ = <b>'+ numberWithCommas(doc.data().UseBudget) +' บาท</b><br>งบประมาณคงเหลือ = <b>'+ numberWithCommas(doc.data().BMBalance) +' บาท</b> <br>สถานะ : '+ xStatus +'</td>';
        } else {
          str += '<br>งบประมาณที่ได้รับ = <b>'+ numberWithCommas(doc.data().BMAllocated) +' บาท</b><br>สถานะ : '+ xStatus +'</td>';
        }

        if(doc.data().BMStatus==0) {
          str += '<td style="text-align: center;"><div class="btn-z0" onclick="OrderGift(\''+ doc.id +'\',\''+ doc.data().BMStatus +'\')">'+ xMsg +'</div></td></tr>';
        } else if(doc.data().BMStatus==1) {
          str += '<td style="text-align: center;"><div class="btn-z1" onclick="OrderGift(\''+ doc.id +'\',\''+ doc.data().BMStatus +'\')">'+ xMsg +'</div></td></tr>';
        } else if(doc.data().BMStatus==2) {
          str += '<td style="text-align: center;"><div class="btn-z2" onclick="OrderGift(\''+ doc.id +'\',\''+ doc.data().BMStatus +'\')">'+ xMsg +'</div></td></tr>';
        } else if(doc.data().BMStatus==3) {
          str += '<td style="text-align: center;"><div class="btn-z3" onclick="OrderGift(\''+ doc.id +'\',\''+ doc.data().BMStatus +'\')">'+ xMsg +'</div></td></tr>';
        } else if(doc.data().BMStatus==9) {
          str += '<td style="text-align: center;"><div class="btn-z9" onclick="OrderGift(\''+ doc.id +'\',\''+ doc.data().BMStatus +'\')">'+ xMsg +'</div></td></tr>';
        } else {
          str += '<td style="text-align: center;"><div class="btn-z0">'+ xMsg +'</div></td></tr>';
        }
        i++;
      }
    });
    str += '</tbody></table></div>';
    str += '<div class="clr"></div>';
    //console.log(i+"==="+sTotalZone);
    $("#DisplayGroup2").html(str);
  });
}


function DisplayGroup_3() {
  var str = "";
  var i = 0;
  var xStatus = "";
  var xMsg = "";
  str += '<center><div class="btn-t22a"><b>โซนอนุมัติการสั่งจอง</b></div></center>';
  str += '<table class="table table-bordered" class="font13" style="background-color: #fff;margin-top:20px;">';
  str += '<thead><tr style="text-align: center;background-color: #93a3c1;">';
  str += '<th scope="col">No.</th><th scope="col">สาขา</th><th scope="col">รายการ</th></tr></thead><tbody>';
  dbNewyearData.where('EmpID_Zone','==',parseFloat(sessionStorage.getItem("EmpID_Newyear")))
  .where('GroupTeam','==',2)
  .orderBy('BranchID','asc')
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      //console.log(doc.data().BranchName);
      //if(doc.data().Zone_Approve!=0) { 
        xMsg = "";
        if(doc.data().BMStatus==0) { 
          xMsg = "สาขายัง<br>ไม่เริ่มสั่ง";
          xStatus = "<font color='#555555'><b>สาขายังไม่เริ่มสั่งจอง</b></font>";
        } else if(doc.data().BMStatus==1) {
          xMsg = "อยู่ระหว่าง<br>การสั่งจอง";
          xStatus = "<font color='#555555'><b>สาขาอยู่ระหว่างการสั่งจอง</b></font>";
        } else if(doc.data().BMStatus==2) {
          xMsg = "สาขาส่ง<br>ขออนุมัติ";
          xStatus = "<font color='#0056ff'><b>สาขาส่งรายการขออนุมัติ</b></font>";
        } else if(doc.data().BMStatus==3) {
          xMsg = "ส่งสาขา<br>ทบทวน";
          xStatus = "<font color='#ff0000'><b>โซนแจ้งทบทวนการจัดซื้อใหม่</b></font>";
        } else if(doc.data().BMStatus==8) {
          xMsg = "โซนแจ้ง<br>ยกเลิก";
          xStatus = "<font color='#ff0000'><b>โซนแจ้งขอยกเลิกการจอง</b></font>";
        } else if(doc.data().BMStatus==9) {
          xMsg = "โซนอนุมัติ<br>รายการแล้ว";
          xStatus = "<font color='#28c92a'><b>โซนอนุมัติรายการแล้ว</b></font>";
        }

        str += '<tr><th scope="row" style="text-align: center;">'+ (i+1) +'</th>';
        //str += '<td style="text-align: left; line-height: 1.2;"><font color="#0056ff"><b>'+ doc.data().BranchName +'</b> ['+ doc.data().BMStatus +']</font>';
        str += '<td style="text-align: left; line-height: 1.2;"><font color="#0056ff"><b>'+ doc.data().BranchName +'</b></font>';
        if(doc.data().BMStatus==0) {
          str += '<br>งบประมาณที่ได้รับ = <b>'+ numberWithCommas(doc.data().BMAllocated) +' บาท</b><br>งบประมาณคงเหลือ = <b>'+ numberWithCommas(doc.data().BMBalance) +' บาท</b> <br>สถานะ : '+ xStatus +'</td>';
        } else if(doc.data().BMStatus==1 || doc.data().BMStatus==3) {
          str += '<br>ยอดการสั่งซื้อ = <b>'+ numberWithCommas(doc.data().UseBudget) +' บาท</b><br>งบประมาณคงเหลือ = <b>'+ numberWithCommas(doc.data().BMBalance) +' บาท</b> <br>สถานะ : '+ xStatus +'</td>';
          //str += '<br>งบประมาณที่ได้รับ = <b>'+ addCommas(doc.data().BMAllocated) +' บาท</b><br>สถานะ : '+ xStatus +'</td>';
        } else if(doc.data().BMStatus==2) {
          str += '<br>ยอดการสั่งซื้อ = <b>'+ numberWithCommas(doc.data().UseBudget) +' บาท</b><br>งบประมาณคงเหลือ = <b>'+ numberWithCommas(doc.data().BMBalance) +' บาท</b> <br>สถานะ : '+ xStatus +'</td>';
        } else {
          str += '<br>งบประมาณที่ได้รับ = <b>'+ numberWithCommas(doc.data().BMAllocated) +' บาท</b><br>งบประมาณคงเหลือ = <b>'+ numberWithCommas(doc.data().BMBalance) +' บาท</b> <br>สถานะ : '+ xStatus +'</td>';
        }

        if(doc.data().BMStatus==0) {
          str += '<td style="text-align: center;"><div class="btn-z0">'+ xMsg +'</div></td></tr>';
        } else if(doc.data().BMStatus==1) {
          str += '<td style="text-align: center;"><div class="btn-z0">'+ xMsg +'</div></td></tr>';
        } else if(doc.data().BMStatus==2) {
          str += '<td style="text-align: center;"><div class="btn-z2" onclick="CheckOrderBM(\''+ doc.id +'\')">'+ xMsg +'</div></td></tr>';
          //str += '<td style="text-align: center;"><div class="btn-z2" onclick="ZoneConfirm(\''+ doc.id +'\','+ doc.data().BMBudget +')">'+ xMsg +'000</div></td></tr>';
        } else if(doc.data().BMStatus==3) {
          str += '<td style="text-align: center;"><div class="btn-z3" onclick="CheckOrderBM(\''+ doc.id +'\')">'+ xMsg +'</div></td></tr>';
        } else if(doc.data().BMStatus==9) {
          str += '<td style="text-align: center;"><div class="btn-z9" onclick="CheckOrderBM(\''+ doc.id +'\')">'+ xMsg +'</div></td></tr>';
        }
        i++;
      //}
    });
    str += '</tbody></table></div>';
    str += '<div class="clr"></div>';
    $("#DisplayGroup3").html(str);
  });
}


var xBMStatus = 0;
var xNameBM = "";
var xIDBranch = "";
var xBranchName = ""; 
var xBMBudget = 0;
var xBMAllocated = 0;
var xZoneMemoToBM = "";
function CheckOrderBM(gid) {
  xNameBM = "";
  xIDBranch = "";
  xBranchName = ""; 
  xBMBudget = 0;
  xZoneMemoToBM = "";
  dbNewyearData.where(firebase.firestore.FieldPath.documentId(), "==", gid)
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      xBMStatus = doc.data().BMStatus;
      xNameBM = doc.data().BMName;
      xIDBranch = doc.data().BranchID;
      xBranchName = doc.data().BranchName;
      xBMAllocated = doc.data().BMAllocated;
      if(doc.data().ZoneMemoToBM!=undefined) { 
        xZoneMemoToBM = doc.data().ZoneMemoToBM;
      }
    });
    ZoneConfirm(gid);
  });
}


function ZoneConfirm(gid) {
  var str = "";
  var xSumItem = 0;
  var xSumMoney = 0;
  //var xMemoToBM = "";
  //var xBMAllocated = gBMBudget;
  str += '<div style="line-height:1.3;margin-top:30px; text-align:left; font-weight:600;">สาขา : '+ xBranchName +' ('+xIDBranch+')<br>BM : '+ xNameBM +'</div>';
  str += '<table class="table table-bordered" class="font13" style="background-color: #fff; margin-top:10px;">';
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
    //str += '<tr><td style="text-align: center;font-weight: 600;background:#f1f1f1;">ยอดรวมจำนวน (ชิ้น)</td><td colspan="2" style="text-align: right;font-weight: 600;background:#31e85b;">'+ addCommas(xSumItem) +'</td></tr>';
    str += '<tr><td style="text-align: center;font-weight: 600;background:#f1f1f1;">ยอดรวมการสั่งซื้อ</td><td colspan="2" style="text-align: right;font-weight: 600;background:#f68b1f;">'+ numberWithCommas(xSumMoney) +'</td></tr>';
    str += '<tr><td style="text-align: center;font-weight: 600;background:#f1f1f1;">งบประมาณคงเหลือ</td><td colspan="2" style="text-align: right;font-weight: 600;background:#0056ff;">'+ numberWithCommas(xBMAllocated-xSumMoney) +'</td></tr>';
    str += '</tbody></table>';
    str += '<div style="text-align:left; margin:20px 0 2px 5px;">ข้อคิดเห็นของโซน กรณีแจ้งสาขาทบทวนใหม่</div><center><textarea id="txtMemoToBM" name="MemoToBM" style="width:98%; height:80px;text-align:left;font-weight:600; color:#000;">'+ xZoneMemoToBM +'</textarea></center></div>';
    console.log(xBMStatus);
    if(xBMStatus!=9 && xBMStatus!=3) {
      str += '<div class="btn-z9" onclick="SaveConFirm(\''+ gid +'\')" style="margin:20px 10px 20px auto;">อนุมัติ<br>การสั่งซื้อ</div>';
      str += '<div class="btn-z3" onclick="SaveCancel(\''+ gid +'\')" style="margin:20px 10px 20px auto;">แจ้งสาขา<br>ทบทวนใหม่</div>';
    }
    str += '<div class="btn-z0" onclick="CloseAll()" style="margin:20px 10px 20px auto;">ปิดหน้าต่าง<br>รายการนี้</div>';
    $("#DisplayBMListItem").html(str);
  });
  document.getElementById('id02').style.display='block';
}


function SaveConFirm(gid) {
  NewDate();
  dbNewyearData.doc(gid).update({
    BMStatus : 9,
    ZoneMemoToBM : "อนุมัติ<br>"+dateString+"<br>",
    Date_Approve : dateString
  });

  var delayInMilliseconds = 1000; //1 second
  setTimeout(function() {
  //DisplayGroup_1();
  DisplayGroup_2();
  DisplayGroup_3();
  document.getElementById('id02').style.display='none';
  }, delayInMilliseconds);
}


function SaveCancel(gid) {
  NewDate();
  var xCancelMemo = document.getElementById("txtMemoToBM").value;
  if(xCancelMemo!="") {
    dbNewyearData.doc(gid).update({
      BMStatus : 3,
      ZoneMemoToBM : " "+ xCancelMemo +" ("+ dateString +")",
      Date_Approve : dateString
    });
    var delayInMilliseconds = 1000; //1 second
    setTimeout(function() {
    //DisplayGroup_1();
    DisplayGroup_2();
    DisplayGroup_3();
    document.getElementById('id02').style.display='none';
    }, delayInMilliseconds);

    //document.getElementById('id02').style.display='none';
  } else {
    alert("กรุณากรอกรายละเอียดก่อนที่จะทำการบันทึกรายการ และแจ้งสาขาให้ทำการแก้ไข");
  }
}


function  OrderGift(gid,gStatus) {
  location.href = "ordergift.html?gid="+gid+"&gStatus="+gStatus;
}


function ShowProfile() {
  var str = "";
  str += '<center>';
  str += '<div><img src="'+ sessionStorage.getItem("LinePicture") +'" class="add-profile" style="margin:-70px auto 20px auto;"></div>';
  str += '<div style="color:#fff; font-size: 14px; font-weight: 600;"><center><b>'+ sessionStorage.getItem("EmpName_Newyear")+'</b></div>';
  str += '<div style="color:#fff; font-size: 13px;padding:2px;font-weight: 400;line-height: 1.3;margin-bottom: 10px;">'+ sessionStorage.getItem("EmpPosition_Newyear")+'<br>'+ sessionStorage.getItem("EmpBR_Newyear")+'<br>โซน '+ sessionStorage.getItem("EmpZone_Newyear")+' / ภาค '+ sessionStorage.getItem("EmpRH_Newyear")+'</div>';
  //str += '<div style="font-size: 14px; color:#f68b1f; margin:25px auto 5px auto;font-weight: 600;">PRU Point สะสมคงเหลือ<br><font color="#002d63"><b>ข้อมูล ณ วันที่ '+ sessionStorage.getItem("DataUpDate") +'</b></font></div>';
  str += '<div class="clr"></div>';
  //str += '<div style="margin-bottom:30px;"><img src="./img/coin.png" style="width:50px;"></div>';
  //str += '<div class="border-timer-red" style="margin-top:-55px;">';
  //str += ''+ addCommas(sessionStorage.getItem("ThisPoint"))+'</div>';
  //str += '<div class="clr"></div>';
  //str += '<div class="btn-blue" style="margin-top:35px;" onclick="GotoRewards()">';
  //str += '<div style="font-size: 13px; font-weight: 600;">คลิก เพื่อแลกของรางวัล</div></div>';
  //str += '<div style="color:#888888; font-weight: 14px;margin:10px auto;">คลิกเพื่อไปแลกรางวัลกันเลย</div>';
  str += '<div class="clr" style="height: 20px;"></div>';
  str += '</center>';
  $("#MyProfile").html(str);  
  document.getElementById('loading').style.display='none';
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

function GotoRewards() {
  location.href = "rewards.html";
}

function CloseAll() {
  document.getElementById('id01').style.display='none';
  document.getElementById('id02').style.display='none';
  //document.getElementById('id03').style.display='none';
}


