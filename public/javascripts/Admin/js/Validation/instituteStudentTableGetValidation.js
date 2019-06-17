$(document).ready(function () {
    // $('#SearchEnrollment').keypress(function (e) {
    //     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
    //         //display error message
    //
    //         $("#lblSearchErrorForName").html("Digits Only excepted").show().fadeOut("slow");
    //         return false;
    //     }
    //     myFunction();
    // });
    // $(document).on('keyup', '#SearchEnrollment', function (e) {
    //     myFunction();
    // });
    $(".allownumericwithoutdecimal").on("keypress keyup blur", function (event) {
        // $("#lblSearchErrorForName").text("");
        $(this).val($(this).val().replace(/[^\d].+/, ""));

        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
            // $("#lblSearchErrorForName").text("Digits Only excepted");
            // return false;
        }

        myFunction();
    });

    function myFunction() {
        var input, filter, table, tr, td, i;
        input = document.getElementById("SearchEnrollment");
        filter = input.value.toUpperCase();
        table = document.getElementById("tblDataForStudent");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[2];
            if (td) {
                if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
});
