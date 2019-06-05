$(document).ready(function(){

    const rv = new ResetValidator();
    
    $('#set-password-form').ajaxForm({
        beforeSubmit : function(formData, jqForm, options){;
            rv.hideAlert();
            return rv.validatePassword($('#pass-tf').val()) != false;
        },
        success	: function(responseText, status, xhr, $form){
            $('#set-password-submit').addClass('disabled');
            $('#set-password-submit').prop('disabled', true);
            rv.showSuccess("Your password has been reset.");
            setTimeout(function(){ window.location.href = '/'; }, 3000);
        },
        error : function(){
            rv.showAlert("I'm sorry something went wrong, please try again.");
        }
    });

    $('#set-password').modal('show');
    $('#set-password').on('shown', function(){ $('#pass-tf').focus(); })

});