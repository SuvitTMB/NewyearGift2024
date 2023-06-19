var i = 0;
var EidProfile = "";
var dateString = "";
var sResultLogin ="ไม่สำเร็จ"
var CheckFoundData = 0;
var EidUpdateLogin = "";
var CountLogin = 0;
var CheckFound = 0;


$(document).ready(function () {

/*
  sessionStorage.clear(); 
  var str = "";
  var sLineID = "Ua6b6bf745bd9bfd01a180de1a05c23b3";
  var sLineName = "Website";
  var sLinePicture = "https://profile.line-scdn.net/0hoLlg-mNNMGNRHiaTpMdPNG1bPg4mMDYrKX8qVnIYOgYpe3QwbCp2AXVKaVN_fnMzOC16V3NMagF8";
  sessionStorage.setItem("LineID", sLineID);
  sessionStorage.setItem("LineName", sLineName);
  sessionStorage.setItem("LinePicture", sLinePicture);
  str += '<div><img src="'+ sessionStorage.getItem("LinePicture") +'" class="add-profile" width="100px"></div>';
  str += '<div class="NameLine">'+ sessionStorage.getItem("LineName")+'</div>';
  $("#MyProfile").html(str);  
  Connect_DB();
   
*/
  main();

  dbProfile = firebase.firestore().collection("CheckProfile");
  dbNewyearMember = firebase.firestore().collection("Newyear2024_member");
  dbNewyearData = firebase.firestore().collection("Newyear2024_data");
  dbNewyearLog = firebase.firestore().collection("Newyear2024_log");

  CheckData();
});



async function main() {
  await liff.init({ liffId: "1657509542-koZVxvjW" });
  document.getElementById("isLoggedIn").append(liff.isLoggedIn());
  if(liff.isLoggedIn()) {
    getUserProfile();
  } else {
    liff.login();
  }
}


async function getUserProfile() {
  var str = "";
  const profile = await liff.getProfile();
  sessionStorage.setItem("LineID", profile.userId);
  sessionStorage.setItem("LineName", profile.displayName);
  sessionStorage.setItem("LinePicture", profile.pictureUrl);
  str += '<div><img src="'+ sessionStorage.getItem("LinePicture") +'" class="add-profile" width="100px"></div>';
  str += '<div class="NameLine">'+ sessionStorage.getItem("LineName")+'</div>';
  $("#MyProfile").html(str);  
  Connect_DB();
}


function openWindow() {
  liff.openWindow({
    url: "https://line.me",
    external: true     
  })
}


function CheckData() {
  dbProfile.where('lineID','==',sessionStorage.getItem("LineID"))
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      CheckFoundData = 1;
      if(doc.data().statusconfirm==1) {
        EidProfile = doc.id;
        sessionStorage.setItem("EmpID_Newyear", doc.data().empID);
        CheckMember();
      } else {
        location.href = "https://liff.line.me/1655966947-KxrAqdyp";
      }
    });
    if(CheckFoundData==0) {
      location.href = "https://liff.line.me/1655966947-KxrAqdyp"; 
    }
  });
}


function CheckMember() {
  dbNewyearMember.where('EmpID','==',parseFloat(sessionStorage.getItem("EmpID_Newyear")))
  .limit(1)
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      CheckFound = 1;
      EidUpdateLogin = doc.id;
      CountLogin = doc.data().CountIN;
      sResultLogin ="สำเร็จ"
      sessionStorage.setItem("EmpName_Newyear", doc.data().EmpName);
      sessionStorage.setItem("EmpPosition_Newyear", doc.data().EmpPosition);
      sessionStorage.setItem("EmpBR_Newyear", doc.data().EmpBR);
      sessionStorage.setItem("EmpZone_Newyear", doc.data().EmpZone);
      sessionStorage.setItem("EmpRH_Newyear", doc.data().EmpRH);
      UpdateLogin();
      UpdateBBDLog();
      document.getElementById('loading').style.display='none';
      document.getElementById('OldSurvey').style.display='block';
    });

    if(CheckFound==0) {
      UpdateBBDLog();
      document.getElementById('loading').style.display='none';
      document.getElementById('NoService').style.display='block';
    }
  });
}


function UpdateLogin() {
  NewDate();
  var TimeStampDate = Math.round(Date.now() / 1000);
  dbNewyearMember.doc(EidUpdateLogin).update({
    LogDateTime : dateString,
    LogTimeStamp : TimeStampDate,
    LineName : sessionStorage.getItem("LineName"),
    LinePicture : sessionStorage.getItem("LinePicture"),
    CountIN : parseFloat(CountLogin)+1
  });    
}


function UpdateBBDLog() {
  NewDate();
  var TimeStampDate = Math.round(Date.now() / 1000);
  dbNewyearLog.add({
    LineID : sessionStorage.getItem("LineID"),
    LineName : sessionStorage.getItem("LineName"),
    LinePicture : sessionStorage.getItem("LinePicture"),
    EmpID : sessionStorage.getItem("EmpID_Newyear"),
    EmpName : sessionStorage.getItem("EmpName_Newyear"),
    PageVisit : "Newyear Gift 2024",
    ResultLogin : sResultLogin,
    LogDateTime : dateString,
    LogTimeStamp : TimeStampDate
  });
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
  //document.getElementById('id01').style.display='none';
  document.getElementById('id02').style.display='none';
  document.getElementById('id03').style.display='none';
}
