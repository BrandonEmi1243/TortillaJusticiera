$(document).ready(function(){
	if($('.mpTableCustom input').length)
	{
		$('.mpTableCustom input').blur(function(){
			updateCustomData(this);
		});
		$('.mpTableCustom select').change(function(){
			updateCustomData(this);
		});	
	}
	loadEventMPAccount();
	
});
function loadEventMPAccount(){
	
	if($("#mpProductCustomerList").length){
		 $("#mpProductCustomerList").dataTable({
				"bJQueryUI": true,
				"bPaginate": false,
				"bLengthChange": false,
				"bFilter": true,
				"bSort": true,
				"bInfo": false,
				"bAutoWidth": false,
				"iDisplayLength": 50,
				"dom": 'Bfrtip',
				"buttons": [
        			 
        	            
        	            'csvHtml5',
        	        ],
        "footerCallback": function ( row, data, start, end, display ) {
		            var api = this.api(), data;

		            // Remove the formatting to get integer data for summation
		            var intVal = function ( i ) {
		                return typeof i === 'string' ?
		                    i.replace(',','.').replace(/[^\d.]/g, '')*1 :
		                    typeof i === 'number' ?
		                        i : 0;
		            };
		            // Total over all pages
		            total = api
		                .column(9)
		                .data()
		                .reduce( function (a, b) {
		                    return intVal(a) + intVal(b);
		                } );
		            
		            totalQty = api
		                .column(8)
		                .data()
		                .reduce( function (a, b) {
		                    return intVal(a) + intVal(b);
		                } );    

		            // Total over this page
		            pageTotal = api
		                .column(9, { page: 'current'} )
		                .data()
		                .reduce( function (a, b) {
		                    return intVal(a) + intVal(b);
		                }, 0 );
		             // Total over this page
		            pageTotalQty = api
		                .column(8, { page: 'current'} )
		                .data()
		                .reduce( function (a, b) {
		                    return intVal(a) + intVal(b);
		                }, 0 );    

		            pageTotal =parseFloat(Math.round(pageTotal * 100) / 100).toFixed(2);
		            total =parseFloat(Math.round(total * 100) / 100).toFixed(2);
		            
		           // pageTotalQty =parseFloat(Math.round(pageTotalQty * 100) / 100).toFixed(2);
		            //totalQty =parseFloat(Math.round(totalQty * 100) / 100).toFixed(2);
		            
		            // Update footer
		            $(api.column(9).footer()).html(
		                ''+pageTotal +' ('+ total +')'
		            );
		            $(api.column(8).footer()).html(
		                ''+pageTotalQty +' / '+ totalQty 
		            );

				},
	        
        "initComplete": function () {
    	            this.api().columns().every( function () {
    	            	var column = this;
    	            	if($(column.footer()).hasClass('dtselector'))
    	            	{  
    	  	                var select = $('<select><option value=""></option></select>')
    	  	                    .appendTo( $(column.footer()).empty() )
    	  	                    .on( 'change', function () {
    	  	                        var val = $.fn.dataTable.util.escapeRegex(
    	  	                            $(this).val()
    	  	                        );
    	  	 
    	  	                        column
    	  	                            .search( val ? '^'+val+'$' : '', true, false )
    	  	                            .draw();
    	  	                    } );
    	  	 
    	  	                column.data().unique().sort().each( function ( d, j ) {
    	  	                    select.append( '<option value="'+d+'">'+d+'</option>' )
    	  	                } );
    	            	} 
    	            	if($(column.header()).hasClass('dtselector'))
    	            	{  
    	  	                var select = $('<br/><select><option value=""></option></select>')
    	  	                    .appendTo( $(column.header()) )
    	  	                    .on( 'change', function () {
    	  	                        var val = $.fn.dataTable.util.escapeRegex(
    	  	                            $(this).val()
    	  	                        );
    	  	 
    	  	                        column
    	  	                            .search( val ? '^'+val+'$' : '', true, false )
    	  	                            .draw();
    	  	                    } );
    	  	 
    	  	                column.data().unique().sort().each( function ( d, j ) {
    	  	                    select.append( '<option value="'+d+'">'+d+'</option>' )
    	  	                } );
    	            	} 
    	            	if ($(column.footer()).hasClass('dtinput'))
    	            	{  
    	  	                var select = $('<input>')
    	  	                    .appendTo( $(column.footer()).empty() )
    	  	                    .on( 'change', function () {
    	  	                        var val = $.fn.dataTable.util.escapeRegex(
    	  	                            $(this).val()
    	  	                        );
    	  	 
    	  	                        column
    	  	                            .search(val)
    	  	                            .draw();
    	  	                    } );
    	  	 
    	  	               
    	            	}
    	            	if ($(column.header()).hasClass('dtinput'))
    	            	{  
    	            		var select = $('<br/>')
	  	                    .appendTo( $(column.header()));
    	  	                select = $('<input>')
    	  	                    .appendTo( $(column.header()))
    	  	                    .on( 'change', function () {
    	  	                        var val = $.fn.dataTable.util.escapeRegex(
    	  	                            $(this).val()
    	  	                        );
    	  	 
    	  	                        column
    	  	                            .search(val)
    	  	                            .draw();
    	  	                    } );     
    	            	}
    	            } );
    	        }
      });
	}
}
function updateCustomData(el)
{
	var tr = $(el).parents('tr:first');
	var id = $(tr).data('id');
	var id_megacart = $(tr).data('mega');
	var mpname = $(tr).find('.mpName').val();
	var mpmobile = $(tr).find('.mpPhone').val();
	var mpemail = $(tr).find('.mpEmail').val();
	var mpsex = $(tr).find('.mpSex').val();
	var mpdni = $(tr).find('.mpDni').val();
	
	var url = '../modules/megaproduct/ajax_admin.php';
	var fieldArray = {id:id,id_megacart:id_megacart,name:mpname,mobile:mpmobile,email:mpemail,sex:mpsex,dni:mpdni};
	var fieldData = '&action=saveCustomData&mpcustom='+JSON.stringify(fieldArray);
	var posting = $.post( url, fieldData);

}

function applyMPCustomPersonalization()
{
	if(!$('#megaproduct').length ||  !$('#customMPForm').length)
	return;
	
	var qty = parseInt($('#quantity_wanted').val());
	if($('#addTicketZones').length)
	{
		qty = getQuantityMegaSeats();
	}
	var form = $('#customMPForm').html();
	$('#customQuantityMPForm').html('');
	for(var i=0;i<qty;i++)
	{
		
		var k = i+1;
		formfinal = form.replaceAll('sex0','sex'+k);
		$('#customQuantityMPForm').append('<div id="customMPForm'+k+'" class="customMPForm" style="display:none">'+formfinal+'</div>');
	}
	$('#customMPBefore').hide();
	if(qty==1)
	{
		
		$('#customMPNext').hide();
	}
	else
	{
		
		$('#customMPNext').show();
	}
	$('#customMPNumber').html(1);
	$('#customMPTotal').html(qty);
	$('#customQuantityMPForm').find('.customMPForm:first').show();
}
function showMPCustomEmail(el){
	var divcontent = $(el).parents('.customMPForm:first').find('.customMPEmail');
	if($(divcontent).is(":visible"))
		$(divcontent).find('input').val('');
	$(divcontent).toggle();
}
function showMPPageCustom(type){
	$('#customMPNext').show();
	$('#customMPBefore').show();
	$('.customMPForm').hide();
	
	var page = parseInt($('#customMPNumber').html());
	var totalpage = parseInt($('#customMPTotal').html());
	var newpage = 0;
	if(type=='next')
	{
		newpage = page+1;
		$('#customMPBefore').show();
	}
	if(type=='before')
	{
		newpage = page-1;
	}
	showMPPage(newpage);
}
function showMPPage(page)
{
	$('#customMPError').hide();
	var totalpage = parseInt($('#customMPTotal').html());
	$('.customMPForm').hide();
	$('#customMPForm'+page).show();
	$('#customMPNumber').html(page);
	if(page==1)
		$('#customMPBefore').hide();
	if(totalpage==page)
		$('#customMPNext').hide();
}
function listMPCustom()
{
	_MP.arrayCustom = new Array();
	var customgroups = new Array();
	var i = 1;
	var hasError = false;
	$('#customQuantityMPForm .customMPForm').each(function(){
		var sex = $(this).find('input[name=sex'+i+']:checked').val();
		var name = $(this).find('#name').val();
		var dni = $(this).find('#dni').val();
		var mobile_phone = $(this).find('#mobile_phone').val();
		var email = $(this).find('#email').val();
		var arrayValues =  {sex: sex, name: name, dni: dni, mobile: mobile_phone, email: email};
		if(name=='' || dni=='')
		{
			hasError = true;
			showMPPage(i);
			$('#customMPError').show();
			return false;
		}
		customgroups[i-1]=arrayValues;
		i++;
	});
	
	if(!hasError && customgroups.length)
	{
		_MP.arrayCustom = customgroups;
		if($('#addListSeat').length)
			$('#addListSeat').click();
		else
			$('#btnAddCalculeService').click();
	}
	
	return '';
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};