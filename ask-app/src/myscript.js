$(document).ready(function() {
        $('#nav-toggle').click(function(event) {
          $(this).toggleClass('active');
          if ($('#nav-toggle').hasClass('active')) 
          {
            $('#nav').show();
          } 
          else
          {
            $('#nav').hide();
          };
        });
      });