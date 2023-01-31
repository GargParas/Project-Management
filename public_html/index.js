
var jpdbBaseUrl = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml";
var jpdbIRL = "/api/irl";
var projDBName = "COLLEGE-DB";
var projRelationName = "PROJECT-TABLE";
var connToken = "90938032|-31949270786334998|90954400";
$("#projId").focus();
    
function validateData() {
    
    var projId,projTitle,assTo,assDate,deadline;
    projId = $("#projId").val();
    projTitle = $("#projTitle").val();
    assTo = $("#assTo").val();
    assDate = $("#assDate").val();
    deadline = $("#deadline").val();
    
    if (projId === "") {
        alert("This is a required field");
        $("#projId").focus();
        return "";
    } 
    if (projTitle === "") {
        alert("This is a required field");
        $("#projTitle").focus();
        return "";
    } 
    if (assTo === "") {
        alert("This is a required field");
        $("#assTo").focus();
        return "";
    }
    
    if (assDate === "") {
        alert("This is a required field");
        $("#assDate").focus();
        return "";
    }
    if (deadline === "") {
        alert("This is a required field");
        $("#deadline").focus();
        return "";
    }
    
    var jsonStrObj = {
        project_id: projId,
        project_name: projTitle,
        assigned_to: assTo,
        assigned_date: assDate,
        deadline: deadline
    };
    return JSON.stringify(jsonStrObj);
}

//reseting the form values
function resetForm() {
    $("#projId").val("");
    $("#projTitle").val("");
    $("#assTo").val("");
    $("#assDate").val("");
    $("#deadline").val("");
    
    $("#projId").prop('disabled',false);
    $("#save").prop('disabled',true);
    $("#update").prop('disabled',true);
    $("#reset").prop('disabled',true);
    $("#projId").focus();
}

//on click function
function saveProj() {
    alert("save");
    console.log("save");
    var jsonStr = validateData();
    if (jsonStr === "") {
        return "";
    }
    
    var putReqStr = createPUTRequest(connToken,jsonStr,projDBName,projRelationName);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr,jpdbBaseUrl,jpdbIML);
    alert("1 Record Added");
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#projId").focus();
}

function updateProj() {
    $("#updateProj").prop('disabled',true);
    
    var jsonchag = validateData();
    
    var updateReq = createUPDATERecordRequest(connToken,jsonchag,projDBName,projRelationName,localStorage.getItem('recno'));
    
    jQuery.ajaxSetup({async: false});
    var resultJsonObj = executeCommandAtGivenBaseUrl(updateReq,jpdbBaseUrl,jpdbIML);
    jQuery.ajaxSetup({async: true});
    alert("1 Record Updated");
    resetForm();
    $("#projId").focus();
}

function getProjIdAsJsonObj(){
    var projid = $('#projId').val();
    var jsonStr = {
        project_id:projid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#projTitle').val(record.project_name);
    $('#assTo').val(record.assigned_to);
    $('#assDate').val(record.assigned_date);
    $('#deadline').val(record.deadline);
    alert("1 Record found");
}

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);
}

function getProject(){
    var projIdJsonObj = getProjIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken,projDBName,projRelationName,projIdJsonObj);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest,jpdbBaseUrl,jpdbIRL);
    jQuery.ajaxSetup({async:true});
    if(resJsonObj.status === 400) {
        $("#save").prop('disabled', false);
        $("#reset").prop('disabled', false);
        $("#projTitle").focus();
    }
    else if(resJsonObj.status===200)
    {
        $("#projId").prop('disabled',true);
        fillData(resJsonObj);

        $("#update").prop('disabled', false);
        $("#reset").prop('disabled', false);
        $("#projTitle").focus();
   
    }
}