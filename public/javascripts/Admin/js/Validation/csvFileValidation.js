$(document).ready(function () {

    function fileValidation(){
        var fileInput = document.getElementById('st_file');
        var filePath = fileInput.value;
        var allowedExtensions = /(\.csv)$/i;
        if(!allowedExtensions.exec(filePath)){
            alert('Please upload file having extension .csv only.');
            fileInput.value = '';
            return false;
        }else{
            //Image preview
            if (fileInput.files && fileInput.files[0]) {
                // var reader = new FileReader();
                // reader.onload = function(e) {
                //     document.getElementById('imagePreview').innerHTML = '<img src="'+e.target.result+'"/>';
                // };
                // reader.readAsDataURL(fileInput.files[0]);
                return true;
            }
        }
    }
    $(document).on('change','#st_file',function () {
        fileValidation();
    });
    radioButtonChangeEvent();
    function radioButtonChangeEvent(){
        $('input[type=radio][name=DataStoreType]').change(function() {
            if (this.value == 'CSV') {
                // alert("CSV");
                // document.getElementById('FormBlock').style.display = 'none';
                $("#FormBlock").slideUp("slow");
                // document.getElementById('CSVBlock').style.display = 'block';
                $("#CSVBlock").slideDown("slow");
            }
            else if (this.value == 'Manual') {
                // alert("Manual");
                // document.getElementById('FormBlock').style.display = 'block';
                // document.getElementById('CSVBlock').style.display = 'none';
                $("#CSVBlock").slideUp("slow");
                $("#FormBlock").slideDown("slow");
            }
        });
    }
    $(document).on('show.bs.modal', '#studentsForm', function (e) {
        onLoadRadioButtonFunctionality();
        document.getElementById('radioDivision').style.display='block';
    });
    onLoadRadioButtonFunctionality();
    function onLoadRadioButtonFunctionality() {
        var radio=document.getElementsByName('DataStoreType');
        if(radio.val="CSV")
        {
            // alert('Onload CSV');
            document.getElementById('FormBlock').style.display = 'none';
            document.getElementById('CSVBlock').style.display = 'block';
        }
        else if(radio.val="Manual")
        {
            // alert('Onload Manual');
            document.getElementById('FormBlock').style.display = 'block';
            document.getElementById('CSVBlock').style.display = 'none';
        }
    }

});