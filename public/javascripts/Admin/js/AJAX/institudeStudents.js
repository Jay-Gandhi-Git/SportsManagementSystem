$(document).ready(function () {

    var id=0;
    getAllStudentData();
    function removeAllLabelValue() {
        $('#lblErrorForName').text("");
        $('#instituteName').css("border-color","");
        $('#lblError').text("");
        $('#lblErrorForEnrollment').text("");
        $('#studentsName').css("border-color","");
        $('#lblErrorForEmail').text("");
        $('#studentsEmail').css("border-color","");
        $('#lblErrorForMobile').text("");
        $('#studentMobileNumber').css("border-color","");
    }

    function removeAllInputValues() {
        $('#studentsName').val("");
        $('#studentsEnrollmentNumber').val("");
        $('#studentsEmail').val("");
        $('#studentMobileNumber').val("");
        id=0;
    }
    $(document).on('click','#callingModalForm',function (e) {
        e.preventDefault();
        $("input[name='DataStoreType'][value='CSV']").prop("checked",true);
        removeAllLabelValue();
        removeAllInputValues();
    });

    function getAllStudentData()
    {
        // alert("I came here");
        $.ajax({
            url:"http://localhost:3000/institute/studentGetAjax",
            method:"POST",
            success:function (data) {
                if(data.msg==="Session Expired")
                {
                    window.location.replace('/');
                }
                if (data.success && data.flag==0 && data.msg != null) {
                    alert("MSG: " + data.msg);
                }
                else if(data.success && data.flag==1 && data.msg != null)
                {
                    $('#tblData tbody').empty();
                    var rows=data.msg;
                    for (var i=0 ; i < rows.length ; i++){
                        var row = rows[i];
                        $('#tblData tbody').append('<tr><td style="text-align: center"><input type="checkbox" name="post[]" value='+i+1+'></td><td style="text-align: center">'+row.studentName+'</td><td style="text-align: center">'+row.studentEnrollmentNumber+'</td>' +
                            '<td style="text-align: center">'+row.studentEmail+'</td>'+
                            '<td style="text-align: center">\n' +
                            '<a  class="updateClass" value="'+row._id+'" data-toggle="modal" href="#studentsForm">' +
                            '<i class="fa fa-pencil fa-lg text-success" aria-hidden="true"></i>' +
                            '</a> | '+
                            '<a href="#" class="deleteClass" value="'+row._id+'">' +
                            '<i class="fa fa-trash fa-lg text-danger" aria-hidden="true"></i>' +
                            '</a>'+
                            '</td></tr>');
                        // alert('data : '+(i+1)+' is inserted');
                    }
                }
            },
            error:function (data) {
                swal("Oops!", "Failed to load data!"+data.msg, "error");
            }
        });
    }

    $(document).on('submit','#uploadForm',function (e) {
        e.preventDefault();
        var buttonValue=$('#modalButton').text();
        if(buttonValue=="Save")
        {
            // var radio=document.getElementsByName('DataStoreType');
            var radio = $("input[name='DataStoreType']:checked"). val();
            if(radio==="CSV")
            {
                //write ajax for CSV File Upload to save data
                alert('Ajax CSV');
                $.ajax({
                    url:"http://localhost:3000/institute/studentsAddCSVAjax",
                    method:"POST",
                    data:new FormData(this),
                    dataType:'JSON',
                    contentType:false,
                    cache:false,
                    processData:false,
                    success:function (data) {
                        // alert('success '+data.msg);
                        if(data.success===true && data.msg===null)
                        {
                            // alert('CSV File uploaded successfully');
                            swal("Your record has been uploaded!", {
                                icon: "success",
                            });
                            $('#studentsForm').modal('hide');
                            getAllStudentData();
                        }
                        else if(data.success===true && data.msg==="Please upload the file")
                        {
                            // alert(data.msg);
                            swal("Oops!", "Please upload the file!"+data.msg, "error");
                        }
                        else if(data.success===true && data.msg==="Session Expired")
                        {
                            // alert(data.msg);
                            swal("Oops!", "You are"+data.msg+"!", "error");
                            window.location.replace('/');
                        }
                    },
                    error:function (data) {
                        swal("Oops!", "Error!"+data.msg, "error");
                    }
                })
            }
            else if(radio==="Manual")
            {
                //write ajax for Manual save data for student
                // alert('Ajax Manual');
                var studentsName=document.getElementById('studentsName');
                studentsName=studentsName.value;
                var studentsEnrollmentNumber=document.getElementById('studentsEnrollmentNumber');
                studentsEnrollmentNumber=studentsEnrollmentNumber.value;
                var studentsEmail=document.getElementById('studentsEmail');
                studentsEmail=studentsEmail.value;
                var studentMobileNumber=document.getElementById('studentMobileNumber');
                studentMobileNumber=studentMobileNumber.value;
                if(studentsName.length===0 || studentsEmail.length===0 || studentsEnrollmentNumber.length===0 || studentMobileNumber.length===0)
                {
                    $('#lblError').text("Please fill all the details");
                }
                else {
                    data={studentsName:studentsName,studentsEnrollmentNumber:studentsEnrollmentNumber,studentsEmail:studentsEmail,studentMobileNumber:studentMobileNumber};
                    // alert(studentsEmail);
                    $.ajax({
                        url:"http://localhost:3000/institute/studentsAddManualAjax",
                        method:"POST",
                        data:data,
                        // dataType:'JSON',
                        // contentType:false,
                        // cache:false,
                        // processData:false,
                        success:function (data) {
                            if(data.success===true && data.msg===null)
                            {
                                // alert('Record added successfully');
                                swal("Your record has been uploaded!", {
                                    icon: "success",
                                });
                                $('#studentsForm').modal('hide');
                                getAllStudentData();
                            }
                            else if(data.success===true && data.msg==="Session Expired")
                            {
                                // alert(data.msg);
                                swal("Oops!", "You are"+data.msg+"!", "error");
                                window.location.replace('/');
                            }
                            // alert("Error:- "+data.msg);
                            swal("Oops!", "Error!"+data.msg, "error");
                        },
                        error:function (data) {
                            // alert('Error:::--> '+data.msg);
                            swal("Oops!", "Error!"+data.msg, "error");
                        }
                    })
                }

            }
        }
        else if(buttonValue=="Update")
        {
            // alert('Update block');
            var studentsName=document.getElementById('studentsName');
            studentsName=studentsName.value;
            var studentsEnrollmentNumber=document.getElementById('studentsEnrollmentNumber');
            studentsEnrollmentNumber=studentsEnrollmentNumber.value;
            var studentsEmail=document.getElementById('studentsEmail');
            studentsEmail=studentsEmail.value;
            var studentMobileNumber=document.getElementById('studentMobileNumber');
            studentMobileNumber=studentMobileNumber.value;
            if(studentsName.length===0 || studentsEmail.length===0 || studentsEnrollmentNumber.length===0 || studentMobileNumber.length===0)
            {
                $('#lblError').text("Please fill all the details");
            }
            else {
                data={id:id,studentsName:studentsName,studentsEnrollmentNumber:studentsEnrollmentNumber,studentsEmail:studentsEmail,studentMobileNumber:studentMobileNumber};
                $.ajax({
                    url: "http://localhost:3000/institute/studentUpdateAjax",
                    cache: false,
                    method: "post",
                    data: data,
                    success: function (data) {
                        if (data.success && data.msg != null) {
                            // alert("MSG: " + data.msg);
                            $('#lblError').text(data.msg + " !!");
                            id=0;
                        }
                        else if (data.success && data.msg == null) {
                            // window.location.replace('/dashboard');
                            // alert('Success');
                            swal("Your record has been uploaded!", {
                                icon: "success",
                            });
                            $('#myModalLabel').val('Add your Institute here');
                            $('#studentsForm').modal('hide');
                            getAllStudentData();
                            $("#modalButton").html('Save');
                            id=0;
                        }
                        //alert("Success:Id "+data.sessionData);

                    },
                    error: function (data) {
                        // alert("Error in data : ");
                        swal("Oops!", "Error!"+data.msg, "error");
                    }
                });
            }


        }
    });



    $(document).on('click','.updateClass',function (e) {
        e.preventDefault();
        document.getElementById('FormBlock').style.display = 'block';
        document.getElementById('CSVBlock').style.display = 'none';
        document.getElementById('radioDivision').style.display = 'none';

        id=$(this).attr('value');
        // $('#institueForm').modal('show');
        $("#modalButton").html('Update');

        $('#myModalLabel').val('Update your Institute here');

        // alert('Id is : '+id);
        $.ajax({
            url:'http://localhost:3000/institute/studentGetDataUpdateAjax',
            method:'POST',
            cache:false,
            data:{id:id},
            success:function (data) {
                $('#studentsName').val(data.msg.studentName);
                $('#studentsEnrollmentNumber').val(data.msg.studentEnrollmentNumber);
                $('#studentsEmail').val(data.msg.studentEmail);
                $('#studentMobileNumber').val(data.msg.studentMobileNumber);

            },
            error:function (data) {

            }
        });
    });

    $(document).on('click','.deleteClass',function (e) {
        e.preventDefault();
        var id=$(this).attr('value');

        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this student!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    $.ajax({
                        url:'http://localhost:3000/institute/studentDeleteSingleAjax',
                        method:'post',
                        cache:false,
                        data:{id:id},
                        success:function (data) {
                            // alert("->"+data.msg);
                            swal("Your record has been deleted!", {
                                icon: "success",
                            });
                            id=0;
                            getAllStudentData();
                        },
                        error:function (data) {
                            // alert(data.msg);
                            swal("Oops!", "Error!"+data.msg, "error");
                        }
                    });

                } else {
                    swal("Your record is safe!");
                }
            });

    });
});