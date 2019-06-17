$(document).ready(function () {
    // alert('Hii');

    $("#menu1").children().removeClass("active");
    $("#menu1").children("#liInstitute").addClass("active");

    var id=0;
    getAllInstituteData();
    function removeAllLabelValue() {
        $('#lblErrorForName').text("");
        $('#instituteName').css("border-color","");
        $('#lblError').text("");
        $('#lblErrorForEmail').text("");
        $('#instituteEmail').css("border-color","");
    }
    function getAllInstituteData(){
        $.ajax({
            url: "http://localhost:3000/instituteGetAjax",
            cache: false,
            method: "post",
            success: function (data) {
                if (data.success && data.flag==0 && data.msg != null) {
                    alert("MSG: " + data.msg);
                }
                else if(data.success && data.flag==1 && data.msg != null)
                {
                    $('#tblData tbody').empty();
                    var rows=data.msg;
                    for (var i=0 ; i < rows.length ; i++){
                        var row = rows[i];
                        $('#tblData tbody').append('<tr><td style="text-align: center"><input type="checkbox" name="post[]" value='+i+1+'></td><td style="text-align: center">'+row.instituteName+'</td><td style="text-align: center">'+row.instituteEmail+'</td><td style="text-align: center">\n' +
                            '<a  class="updateClass" value="'+row._id+'" data-toggle="modal" href="#institueForm">' +
                            '<i class="fa fa-pencil fa-lg text-success" aria-hidden="true"></i>' +
                            '</a> | '+
                            '<a href="#" class="deleteClass" value="'+row._id+'">' +
                            '<i class="fa fa-trash fa-lg text-danger" aria-hidden="true"></i>' +
                            '</a>'+
                            '</td></tr>');
                        // alert('data : '+(i+1)+' is inserted');
                    }
                }

                //alert("Success:Id "+data.sessionData);

            },
            error: function (data) {
                alert("Error in data : ");
            }
        });
    }
    function removeAllInputValues() {
        $('#instituteName').val("");
        $('#instituteEmail').val("");
        id=0;
    }
    $(document).on('click','#callingModalForm',function (e) {
        e.preventDefault();
        removeAllLabelValue();
        removeAllInputValues();
    });
    $(document).on('click','#modalButton',function (e) {
        removeAllLabelValue();
        var buttonValue=$('#modalButton').text();
        // alert("Button value: "+buttonValue);
        e.preventDefault();
        var name = document.getElementById("instituteName");
        name = name.value;
        var email = document.getElementById("instituteEmail");
        email = email.value;

        if(name.length===0 || email.length===0)
        {
            if(name.length===0 && email.length===0)
            {
                $('#instituteName').css("border-color","red");
                $('#lblErrorForName').text('Institute name is mendetory');
                $('#instituteEmail').css("border-color","red");
                $('#lblErrorForEmail').text('Institute username is mendetory');
            }
            else if(name.length===0 && email.length!==0)
            {
                $('#instituteName').css("border-color","red");
                $('#lblErrorForName').text('Institute name is mendetory');
            }
            else if(name.length!==0 && email.length===0)
            {
                $('#instituteEmail').css("border-color","red");
                $('#lblErrorForEmail').text('Institute username is mendetory');
            }

        }
        else {
            // alert("Button click called: Name: " + name + " Email: " + email);
            if(buttonValue=="Save"){
                $.ajax({
                    url: "http://localhost:3000/instituteAddAjax",
                    cache: false,
                    method: "post",
                    data: {name: name, email: email},
                    success: function (data) {
                        if (data.success && data.msg != null) {
                            alert("MSG: " + data.msg);
                            $('#lblError').text(data.msg + " !!");
                        }
                        else if (data.success && data.msg == null) {
                            // window.location.replace('/dashboard');
                            // alert('Success');
                            swal({
                                title: "Good job!",
                                text: "Institute added successfully!",
                                icon: "success",
                                button: "Ok!",
                            });
                            $('#institueForm').modal('hide');
                            getAllInstituteData();
                        }
                        //alert("Success:Id "+data.sessionData);

                    },
                    error: function (data) {
                        // alert("Error in data : ");
                        swal("Oops!", "Error!"+ data.msg, "error");
                    }
                });
            }
            else if(buttonValue=="Update")
            {
                $.ajax({
                    url: "http://localhost:3000/instituteUpdateAjax",
                    cache: false,
                    method: "post",
                    data: {id:id,name: name, email: email},
                    success: function (data) {
                        if (data.success && data.msg != null) {
                            alert("MSG: " + data.msg);
                            $('#lblError').text(data.msg + " !!");
                            id=0;
                        }
                        else if (data.success && data.msg == null) {
                            // window.location.replace('/dashboard');
                            // alert('Success');
                            swal({
                                title: "Good job!",
                                text: "Game added successfully!",
                                icon: "success",
                                button: "Ok!",
                            });
                            $('#myModalLabel').val('Add your Institute here');
                            $('#institueForm').modal('hide');
                            getAllInstituteData();
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





        // alert('click event start');

        // alert('click event ends');
    });

    $(document).on('click','#btnFormModal',function (e) {
        e.preventDefault();
        removeAllLabelValue();
    });

    $(document).on('click','.updateClass',function (e) {
        e.preventDefault();
        id=$(this).attr('value');
        // $('#institueForm').modal('show');
        $("#modalButton").html('Update');

        $('#myModalLabel').val('Update your Institute here');
        // alert('Id is : '+id);
        $.ajax({
            url:'http://localhost:3000/instituteGetDataUpdateAjax',
            method:'POST',
            cache:false,
            data:{id:id},
            success:function (data) {

                $('#instituteName').val(data.msg.instituteName);
                $('#instituteEmail').val(data.msg.instituteEmail);
            },
            error:function (data) {

            }
        });
    });
    $(document).on('click','.deleteClass',function (e) {
        e.preventDefault();
        var id=$(this).attr('value');
        // alert("Id is : "+id);
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this institute!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    $.ajax({
                        url:'http://localhost:3000/instituteDeleteSingleAjax',
                        method:'post',
                        cache:false,
                        data:{id:id},
                        success:function (data) {
                            // alert("->"+data.msg);
                            swal("Your record has been deleted!", {
                                icon: "success",
                            });
                            id=0;
                            getAllInstituteData();
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