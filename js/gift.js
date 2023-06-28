var dateString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear()+543;
var gID, gStatus;


$(document).ready(function () {
  if(sessionStorage.getItem("EmpID_Newyear")==null) { location.href = "index.html"; }
  Connect_DB();
  //dbNewyearData = firebase.firestore().collection("Newyear2024_data");
  dbGiftStock = firebase.firestore().collection("Newyear2024_gift");
  LoadGiftStock();
  //dbGiftOrder = firebase.firestore().collection("Newyear2024_order");


  //dbPRUStock = firebase.firestore().collection("PRUstock");
  //CheckBudget();
  //GetUserOrder(gID);
  //LoadReward();
  //LoadGiftStock();
});


function LoadGiftStock() {
  var str = "";
  var i = 0;
  var p1 = 0;
  var p2 = 0;
  var p3 = 0;
  var p4 = 0;
  //var xOrder = 0;
  //xSumAllPrice = 0;
  //xSumUnitPrice = 0;
  //xMaxGift = 0;
  //xCalSell = 0;

  //str += '<table class="table table-bordered" class="font13" style="background-color: #fff;">';
  //str += '<thead><tr style="text-align: center;background-color: #93a3c1;">';
  //str += '<th scope="col">No.</th><th scope="col">รายการของขวัญ</th></tr></thead><tbody>';
  var xCheck = 0;
  dbGiftStock.where('StockStatus','==',1)
  .orderBy('StockGroup','asc')
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      console.log(doc.data().StockGroup);
      if(xCheck!=doc.data().StockGroup==1) {
        //xCheck = doc.data().StockGroup;
        if(doc.data().StockGroup==1) {
          str += '<div id="Point1"></div>';
          if(p1==0) {
            str += '<center><div class="btn-leaderboard">ของขวัญที่มีมูลค่าตั้งแต่ 1 - 50 บาท</div></center>';
            p1 = 1;
          } 
        } else if(doc.data().StockGroup==2) {
          str += '<div id="Point2"></div>';
          if(p2==0) {
            str += '<center><div class="btn-leaderboard">ของขวัญที่มีมูลค่าตั้งแต่ 51 - 100 บาท</div></center>';
            p2 = 1;
          } 
        } else if(doc.data().StockGroup==3) {
          str += '<div id="Point3"></div>';
          str += '<center><div class="btn-leaderboard">ของขวัญที่มีมูลค่าตั้งแต่ 101 - 200 บาท</div></center>';
        } else if(doc.data().StockGroup==4) {
          str += '<div id="Point4"></div>';
          str += '<center><div class="btn-leaderboard">ของขวัญที่มีมูลค่าตั้งแต่ 201 - 400 บาท</div></center>';
        }
      //} else {
      //  xCheck = 0;
      }
      str += '<div class="btn-rewards" style="width:98%; margin:auto;border: 2px solid #eaeaea; margin-bottom: 12px; border-radius: 8px; background-color:#f2f2f2;">';
      str += '<div style="width:100%;text-align:left;padding:8px 8px 5px 8px;"><div class="boxvdo-header">'+doc.data().StockName+'</div></div>';      
      str += '<div style="width:58%; float: left; padding:2px;min-height: 80px; overflow: hidden;"><div class="boxvdo-img"><img src="'+doc.data().StockImg+'" class="img-fluid" style="width:100%;">';
      str += '</div></div>';
      str += '<div class="boxvdo-line10" style="width:40%; float: left; padding-top:8px;line-height: 1.1; min-height: 60px; overflow: hidden;">ราคาขายต่อชิ้น<div class="btn-t0" style="width:110px;"><b>'+doc.data().StockValue+' บาท</b></div><div class="clr" style="height:10px;"></div>คลิกดูรายละเอียด<div class="btn-t1" style="width:110px;" onclick="DisplayGift(\''+ doc.id +'\')" >ดูรายละเอียด</div></div>';
      str += '<div class="clr"></div></div>';
      i++;
      //xMaxGift++;
    });
    //str += '</tbody></table></div>';
    //str += '<div class="clr"></div>';
    $("#DisplayGift").html(str);
    //CalGift();
  });
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
      str += '<div class="clr"></div>';
      str += '<div class="btn-t2" onclick="CloseAll()" style="margin:15px auto 25px auto;">ปิดหน้าต่างนี้</div>';
    });    
    $("#DisplayOrder").html(str);
  });
  document.getElementById('id01').style.display='block';
}




function CloseAll() {
  document.getElementById('id01').style.display='none';
}








