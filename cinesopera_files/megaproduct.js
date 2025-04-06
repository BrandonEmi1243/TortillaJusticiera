/*
* 2011-2019 
*
*  @author Jorge Donet Alberola <soporte@alabazweb.com>  
*  V17.0.*
*/
if(typeof baseDir==="undefined" && typeof prestashop!=="undefined")
	baseDir = prestashop.urls.base_url;

var MegaProduct = jQuery.Class({
	init: function()
	{
		this.quantityInput = $('#quantity_wanted');
		this.backupInput = $("input[type='hidden'][name='submitCustomizedDatas']");
		this.quantityCont = $('#quantity_wanted_p');
		this.attributesCont = $('#attributes');
		this.customizationCont = $('.customization_block');
		this.addCartCont = $('.add .add-to-cart');
	
		
		this.addCartBtn = $('#add_to_cart input');
		this.addBtn = $('#btnAddProduct');
		this.saveCustoBtn = $('#customizedDatas .button');
		this.pageInfoCont = $('#buy_block > p');
		this.MPInitialized = false;
		this.id_product = 0;
		this.custom_id = 0;
		this.productType = 'S';
		this.price_text = '';
		this.stock = '';
		this.modal_info = 0;
		this.ajax_price = 0;
		this.eval_math = 0;
		this.days = 1;
		this.time = 0;
		this.date_start = new Date();
		this.date_end = new Date();
		this.attrPrices = new Array();
		this.attrDefaultDates = new Array();
		this.group_counter = 0;
		this.attr_counter = 0;
		
		this.before_price = '';
		this.after_price = '';
		this.attrIds = '';
		this.calendar_start = 0;
		this.calendar_end = 0;
		this.selectDate = 0;
		this.end_date = 1;
		this.quantityGroups = 0;
		this.lastPersonalization = 0;
		this.actionAvailability = 0;
		this.multiAvailability = new Array();
		this.sendEvent = 0;
		
		this.serviceSelect = new Array();
		this.validation = 0;
		this.diffCalendar = 0;
		this.urls = 0;
		this.arrayCustom = new Array();
		this.seasons = new Array();
		
	},
	addAttrDefaultDate : function(attributes,date_start,date_end){
		var valueToPush = new Array();
		valueToPush['attributes'] = attributes;
		valueToPush['date_start'] = date_start;
		valueToPush['date_end'] = date_end;
		/*if(days!='')
		{
			valueToPush['days'] = days.split('-')
		}
		else
			valueToPush['days'] = new Array();*/
		this.attrDefaultDates.push(valueToPush);
	},
	addAttrPrice : function(id,price,pricebeforedisc,attributes,date_start,date_end,days){
		var valueToPush = new Array();
		valueToPush['id'] = id;
		valueToPush['price'] = price;
		valueToPush['pricebeforedisc'] = pricebeforedisc;
		valueToPush['attributes'] = attributes;
		valueToPush['date_start'] = date_start;
		valueToPush['date_end'] = date_end;
		if(days!='')
		{
			valueToPush['days'] = days.split('-')
		}
		else
			valueToPush['days'] = new Array();
		this.attrPrices.push(valueToPush);
	},
	setProductType : function(type){
		this.productType = type;
		this.MPInitialized = true;
		
	},
	setIdProduct : function(idProduct){
		this.id_product = idProduct;
	},
	setURLS : function(value){
		this.urls = value;
	},
	setCustomId : function(value){
		this.custom_id = value;
	},
	setMeasure : function(value){
		this.measure = value;
	},
	setServiceSelect : function(value){
		this.service_select = value;
		this.serviceSelect = value.split('-');
	},
	setBeforePrice : function(value){
		this.before_price = value;
	},
	setPriceText : function(value){
		this.price_text = value;
	},
	setStock : function(value){
		this.stock = value;
	},
	setModalInfo : function(value){
		this.modal_info = value;
	},
	setAjaxPrice : function(value){
		this.ajax_price = value;
	},

	setAfterPrice : function(value){
		this.after_price = value;
	},
	setCalendarStart : function(value){
		this.calendar_start = value;
	},
	setCalendarEnd : function(value){
		this.calendar_end = value;
	},
	setEndDate : function(value){
		this.end_date = value;
	},
	setTime : function(value){
		this.time = value;
	},
	setActionAvailability : function(actionAvailability){
		this.actionAvailability = actionAvailability;
	},
	setValidation : function(validation){
		this.validation = validation;
	},
	setDiffCalendar : function(diff){
		this.diffCalendar = diff;
	},
	hideContainers : function(){
		
		
		$('.add .add-to-cart').addClass('mpHide');
		//this.addCartCont.addClass('mpHide');
		//this.pageInfoCont.hide();
		$('#availability_label').hide();
		$('#pQuantityAvailable').hide();
		$('#availability_value').hide();
		//$('.product-add-to-cart').hide();
		
		
		
		$('#quantity_wanted_p').show();
		this.changePrice();
		if(!$('#megagroups').length && !$('.divmegapos').length)
			showStepResult();
		
	},
	

	displayPrice : function(price,widthCurrency){
		var priceshow = parseFloat(price).toFixed(2); 
		
		if(widthCurrency)
			priceshow = priceshow.replace(/\./g,",")+' ' +prestashop.currency.sign;
			//priceshow = formatCurrency(priceshow, currencyFormat, currencySign, currencyBlank);
			
		return priceshow;
	},
	getAttrPrice : function(disc){
		var price = 0;
		var arrayPrices = this.attrPrices;
		if(this.attrPrices.length>0)
		{
			var ids = new Array(); 
			
			$('#attributes select, #attributes input[type=hidden], #attributes input[type=radio]:checked').each(function(){
				ids.push($(this).val());
			});
			$.each(ids, function(index, value) {
				var id = parseInt(value);
				for (var i=0;i<arrayPrices.length;i++)
				{
				  if(arrayPrices[i]['id']==id)
				  {
					  var applyPrice = true;
					  var attributes = arrayPrices[i]['attributes'];
					  if(attributes!='')
					  {
						 arrayAttributesAttr =  attributes.split(',');
						 for(var j =0;j<arrayAttributesAttr.length;j++)
						 {
							 if(!in_array(arrayAttributesAttr[j], ids))
								 applyPrice = false;
						 }
					  }
						  
					  if(applyPrice)
					  {
						  if(disc)
							  price += arrayPrices[i]['price'];
						  else
							  price += arrayPrices[i]['pricebeforedisc'];
					  }
				  }
				}
				
			});
		}
		return price;
	},
	changePrice : function(){
		if(this.ajax_price!=1)
		{
			//var price = this.priceAsFloat($('#our_price_display').html());
			var price = $('#mppricedisc').val();
			var newprice = parseFloat($('#mpprice').val());
			var attrPrice = this.getAttrPrice(true);
			var pricebase = newprice+attrPrice;
			if(pricebase==0)
			{
				$('.our_price_display').hide();	
				return;
			}
			else
			{
				$('.our_price_display').show();
			}
			if($('#pretaxe_price_display').length>0)
			{
				 var pricewt = pricebase/(1+(taxRate/100));
				 $('#pretaxe_price_display').html(_MP.displayPrice(pricewt,true)); 
			}
		
			var labelshowprice = this.displayPrice(pricebase,true)+this.after_price;
			if(this.before_price!='')
				labelshowprice = this.before_price+ ' '+ labelshowprice;
			$('#our_price_display').html(labelshowprice);
				if($('.mp_total_price').length)
					$('.mp_total_price').html($('#our_price_display').html());
			
			if($('#old_price_display').length>0)
			{
				var pricedisc = this.priceAsFloat($('#old_price_display').html());
				var newpricedisc = parseFloat($('#mppricedisc').val());
				var pricebasedisc = newpricedisc+this.getAttrPrice(false);
			
				var labelshowprice = this.displayPrice(pricebasedisc,true)+this.after_price;
				$('#old_price_display').html(labelshowprice);
				
			}	
		}
	},
	priceAsFloat : function (price){ 
		var arr = price.split(' ');
		if(arr.length>0)
		   return parseFloat(arr[0].replace(/\./g, '').replace(/,/g,'.').replace(/[^\d\.]/g,''), 10);
		return 0;
	},

	extractPrice : function(price){	
		var value = price.replace(prestashop.currency.sign,'');	
	},
	getTotalMeasure : function()
	{
		
		var width = 1;
		var height = 1;
		var long = 1;
	
		var total = width*height*long;
		return total;
	},
	
	
});

$(window).load(function(){
	applySearchDate();

	if(typeof _MP!='undefined' && _MP.ajax_price==1)
	{
		// SELECT ID GROUPS BY URL
		if(urlcodeparams!='')
		{
			resetGroupsByUrl(urlcodeparams);
			if($.uniform) $.uniform.update();
			changeFilterMPUrlStatus();
			showStepResult();
		}
		showprice( getIdProduct(), getIdCombination(), true, null, $('#quantity_wanted').val(), null);
	}
	
	/*var urlcodeparams = getParameterByName('mpurl');
	
	if(urlcodeparams!='')
	{
		resetGroupsByUrl(urlcodeparams);
	}*/
});	

var urlcodeparams = getParameterByName('mpurl');
function reloadMegaproduct(){
       if(typeof hideMPElements!='undefined'){
	      	$(hideMPElements).addClass('mpHide'); //mpinstall
	    	}
		if($('#megaproduct').length && typeof _MP!='undefined'){
	      	_MP.hideContainers();
	      }
	      if(typeof hideMegaAttributeGroups!='undefined'){
	      	//mpOnlaunch = 0;
	    	  loadMegaproduct();
	    	  if( typeof setSeats!='undefined')
	    	  	setSeats();	
	    	 
	    	  hideMegaAttributeGroups();
	    	  $('#mp-ul-tabs').show();
	    	  if($('#mp-ul-tabs li').length>1){
				$('#mp-ul-tabs').show();
				$('#mp-ul-tabs li.mp-tab:first').click();
			}
	      }
	      
}

$(document).ready(function(){
	loadMegaproduct();
});	
function loadMegaproduct(){
	if(typeof loadMPDataCountdown!='undefined')
		loadMPDataCountdown();
	
	if($('#mp-quantity-limits').length){
		prestashop.on('updateCart', function (event) {checkLimitCartQuantities(); });
	}
	$(document).on('click', '.ajax_cart_block_remove_link', function(){
		setTimeout( function(){window.location.reload();}, 1000);
		});
	
	if(typeof(_MP)!="undefined")
	{
		moveContainerGroups();
		
		// If exist partial payment and groups
		if($('#partial-payment').length && $('#megagroups').length)
			$('#megagroups').append($('#partial-payment'));
		var startdays = 0;
		if(_MP.calendar_start!=0)
		{
			startdays = parseInt(parseInt(_MP.calendar_start)/24);
		}
		
		if(startdays>0){
			startdaysstr = "+"+startdays+"D";
		}else{
			startdaysstr = startdays+"D";
		}
		// Custum nominative personalization
		if (typeof applyMPCustomPersonalization === "function") 
			applyMPCustomPersonalization();
		
		if($('#id_step_quantity').length){
			$('#id_step_quantity').val($('#quantity_wanted').val());
			$('.megaproduct_quantity_up, .megaproduct_quantity_down').click(function(e){
				var qty = parseInt($('#id_step_quantity').val());
				if($(this).hasClass('megaproduct_quantity_up')){
					qty++;
					$('.product_quantity_up').click();
				}
					
				if($(this).hasClass('megaproduct_quantity_down') && qty>1){
					qty--;
					$('.product_quantity_down').click();
				}
					
				$('#id_step_quantity').val(qty);
				$('#id_step_quantity').focus();
				showStepResult();
				if (typeof applyMPCustomPersonalization === "function") 
					applyMPCustomPersonalization();
				
			});
		}	
		
		$('.mp-custom-calendar').datepicker({dateFormat: "dd-mm-yy"});
		if($("#id_date_start").length){
			$("#id_date_start").datepicker({ minDate: startdaysstr,
				showOtherMonths: true,
				selectOtherMonths: true,
				dateFormat: "dd-mm-yy",	
				defaultDate:  get_next_month_with_event(),
				onSelect: function(selectedDate, inst) 
				{
					
					var selectedday =  $("#id_date_start").datepicker("getDate");
					var day =  $("#id_date_start").datepicker("getDate");
					if(_MP.end_date==1){
						day.setDate(day.getDate()+1);
					}
					if(typeof _MP !='undefined' && _MP.diffCalendar!='0')
					{
						$("#id_date_end").datepicker("refresh");
					}
			  
					if(serviceselect==1)
					{
						startWeekDate = new Date(day.getFullYear(), day.getMonth(), day.getDate() - day.getDay());
						selectCurrentWeek();
						$('#id_date_end').datepicker('option', 'minDate', startWeekDate);
					}
					else
					{
						if($('#id_date_end').length)
						{
							$('#id_date_end').datepicker('option', 'minDate', day);
							var selectedday1 =  $("#id_date_end").datepicker("getDate");
							_MP.date_end = selectedday1;
						}
					}
					_MP.selectDate = 1;
					_MP.date_start = selectedday; 
					showStepResult();

				} ,
				beforeShowDay: isAvailable,
			});
			$("#id_date_start").datepicker( "setDate" , get_next_month_with_event() );
			//$("#id_date_start").val(get_next_month_with_event());
		}
			
		
		if(typeof _MP.calendar_end!='undefined' && _MP.calendar_end!=0)
		{
			var enddays = parseInt(parseInt(_MP.calendar_end)/24);
			if(enddays>0){
				enddays = "+"+enddays+"D";
			}else{
				enddays = enddays+"D";
			}
			var dtFechaActual = new Date();
		   	dtFechaActual.setDate(dtFechaActual.getDate() + enddays);
		   
			$("#id_date_start").datepicker( "option", "maxDate",enddays);
		}
		
	$("#id_date_end").datepicker({ 
		dateFormat: "dd-mm-yy",
		showOtherMonths: true,
		
		selectOtherMonths: true,
		onSelect: function(selectedDate) {
			if(serviceselect==1)
				selectCurrentWeek();
			//else
				//$( "#id_date_start" ).datepicker( "option", "maxDate", selectedDate);
		
			if(typeof(_MP)!="undefined")
			{
					var selectedday =  $("#id_date_end").datepicker("getDate");
					_MP.date_end = selectedday;
					showStepResult();
			}
		},
		beforeShowDay: isEndAvailable,
	});
		
	
	addMPEventProduct();
	       
			$('#btnCalculeService,#btnStepCalculeService').click(function(){
				if($('#id_step_quantity').length>0)
					$('#quantity_wanted').val($('#id_step_quantity').val());
				$('#calculePrice').remove();
				$('#megaproducterror').hide();
				calculeservice(getIdProduct(), getIdCombination(), true, null, $('#quantity_wanted').val(), null);
			});
			
			if($('#btnDirectOrder').length)
			{
				 $(document).on("click","#btnDirectOrder",function(e) {
				  e.preventDefault();
		      if($('#id_step_quantity').length>0)
						$('#quantity_wanted').val($('#id_step_quantity').val());
						var addedFromProductPage = true;
					if($('#btnAddCalculeService').parents('body').hasClass('content_only'))
						addedFromProductPage = false;
					
					addMegaProduct( getIdProduct(), getIdCombination(), addedFromProductPage, null, $('#quantity_wanted').val(), null,true);
				});					    
			}
			$(".mp-onlychars").on('keyup', function(e) {
			    var val = $(this).val();
			   if (val.match(/[^a-zA-Z]/g)) {
			       $(this).val(val.replace(/[^a-zA-Z]/g, ''));
			   }
			});
			
	
		if(!$('#megagroups').length)
		{
				$('#attributes .attribute_select').unbind();
				$(document).on('change', '.attribute_select', function(e){
					e.preventDefault();
					findCombination();
					getProductAttribute();
					showStepResult();
					original_url = window.location;
				}); 
					$(document).on('click', '.attribute_radio:radio', function(e){
					e.preventDefault();
					findCombination();
					getProductAttribute();
					showStepResult();
					original_url = window.location;
				}); 
		}
		
		$('#color_to_pick_list a').bind('click', function(event) {
			if(typeof(_MP)!="undefined")
				_MP.hideContainers();
		});
		
	}
	$('#id_step_quantity,#quantity_wanted,#qty,#quantity_wanted_p a').blur(function() {
		if($('#id_step_quantity').length)
			$('#quantity_wanted').val($('#id_step_quantity').val());
		showStepResult();
		//if(typeof rulesArray!='undefined' && rulesArray.length==0)
			showMultiPersonalization();

		
	});
	$('[name=id_drop_date]').change(function(){
		showStepResult();
	});
	
	$('#quantity_wanted_p a').click(function() {
		if($('#id_step_quantity').length)
			$('#quantity_wanted').val($('#id_step_quantity').val());
		showStepResult();
	});
		// Solve plusand minus buttons templates
    $("#quantity_wanted_p a.btn").bind('click',function(e){
         setTimeout(showStepResult,50);
    });

	$('#megaproduct input[type=text]').change(function(){$('#calculePrice').hide();});
	
	$('#mpranges').css('width','300px');

	$('#btnOrderCalendar').click(function(){
		$('#availability').toggle();
		$('.fc-today-button').click();
		showMPInfo('#availability','','');
		
	});
	$('#availability').hide();
	$('#btnAvailability,#btnAvailability2').click(function(){
		
		showMPInfo('#availability','','openMPAvailability');
		
	});
	if($('#attributes').length>0)
	{
		$('#attributes').append($('#megaattributes').html());
		$('#megaattributes').html('');
	}
	else
	{
		$('#megaattributes').hide();
	}
	$('#id_time_slots,#id_days').change(function(){
		
		showStepResult();
	});
	$('.mp-times-combo').change(function(){
		var start = $('#starttime').val();
		var end = $('#endtime').val();
		$('#id_time_slots').val(start+'-'+end);
		$('#id_time_start').val(start);
		$('#id_time_end').val(end);
		showStepResult();
	});
	$('.mp-personalization input,.mp-personalization textarea,.mp-personalization select').blur(function(){	
		showStepResult();
	});
	$('.mp-personalization select').change(function(){	
		showStepResult();
	});
	/*$('.mega-qty-list').blur(function(){	
		showStepResult();
	});*/
	$(".mega-qty-list").bind('keyup mouseup', function () {
		showStepResult();
	});
    $('.mpcheckbox').change(function() {
    	var fieldvalue = $(this).val();
    	var id = $(this).attr('name');
    	var field = '#megafield_'+ fieldvalue;
    	var arraySelect = fieldvalue.split('_');
     	var arrayIds = id.split('_');
    	
    	mpgroup = null;
    	
    		
    		id_group = arrayIds[1];
    		mpgroup = getMPGroupById(id_group);
    	
    		field = '#megafield_'+id_group+'_'+ fieldvalue;
    		
    	
    	
        if($(this).is(":checked")) 
        {
        	$(field).addClass('selectAttr');
        	
        	if(arraySelect.length==2)
        		addMultiselectValues(arraySelect[0],arraySelect[1]);
        	//$(field).click();
        }
        else
        {
        	$(field).removeClass('selectAttr');
        	if(arraySelect.length==2)
        		deleteMultiselectValues(arraySelect[0],arraySelect[1]);
        }
        var attributes = getMultiSelectGroup(id_group);
        changeTitleSelected(mpgroup,id_group,attributes);
        showStepResult();
             
    });
    if(typeof servicedefaultdate!='undefined' && servicedefaultdate!='')
	{
		if($('#id_date_start').length)
		{
			$('#id_date_start').val(servicedefaultdate);
			_MP.date_start = $('#id_date_start').datepicker("getDate");	
		}
		else
		{
			_MP.date_start = new Date(servicedefaultdate);
		}
		_MP.selectDate = 1;	
	}
   
   if(!$('#megagroups').length && checkTimeSlot())
		loadTimeSlots();
   if($('.mptimes').length)
   {
	   $('.mptimes').timepicker();
	   $('.mptimes').blur(function()
	   { 
		   showStepResult();
	   });
   }
    
    $(".resultFloat").draggable({
    	cursor: 'move',
        
    });
    if($('.mp-accept-terms').length)
    {
    	$('.mp-accept-terms a.iframe').fancybox({
    		'type' : 'iframe',
    		'width':600,
    		'height':600
    	});
    }
    addFileUpload('.fileupload');
    
    if($('#id_date_select').length)
    {
    	addMonthYear();
    	selectionMPDate();
    	$('#id_date_select').change(function(){
    		selectionMPDate();
    	});
    	$('#id_month_select').change(function(){
    		selectMPMonth();
    	});
    	if($('#id_week_select').length){
    		loadMPWeeks();
    		$('#id_week_select').change(function(){
        		selectMPWeek();
        	});
    	}
    	
    }
    
   
}
function moveContainerGroups(){
	if($('.mpmovecontainer').length){
		$('.mpmovecontainer').each(function(){
			var id_group = $(this).data('container');
			$(this).appendTo($('#mpcontainer'+id_group));
		});
	}
	if($('#show-result-container.resultFloat').length)
	{
		$('#show-result-container.resultFloat').append($('#megaproducterror'));
	}
	else if($('#mpimages').length)
	{
		$('#mpimages').append($('#megaproducterror'));
	}
	if($('#mpQtySlider').length)
	{
		$('#quantity_wanted_p').addClass('mpHide');
		$('#quantity_wanted_p').parent().append($('#mpQtySlider'));
		
	}
	
}

function openMPAvailability()
{
	$('#availability').show();
	$('#productcalendar').fullCalendar('destroy');
	if(typeof loadFullCalendar!='undefined'){
		loadFullCalendar();
		// _MP.multiAvailability = new Array();
	}
		
	
}
function applySearchDate()
{
		if(typeof searchdate!='undefined' && searchdate!='')
		{
			if($('#id_date_start').length)
			{
				$('#id_date_start').datepicker("setDate", parseMPDate(searchdate, 'yyyy-mm-dd'));
			
				_MP.date_start = $('#id_date_start').datepicker("getDate");	
			}
			else
			{
				_MP.date_start = new Date(searchdate);
			}
			_MP.days = 1;
			_MP.selectDate = 1;
			loadTimeSlots();
			
		}
		if(typeof searchdays!='undefined')
		{
			searchdays = parseInt(searchdays);
			if(searchdays>0)
			{
				if($('#id_date_end').length)
				{
					var day =  $("#id_date_start").datepicker("getDate");
					day.setDate(day.getDate()+searchdays); 
					_MP.date_end = day;
		  
					$('#id_date_end').datepicker("setDate", new Date(day));	
				}
				if($('#id_days').length)
				{
					$('#id_days').val(searchdays);
				}	
				_MP.days = searchdays;
			}
		}
			
		
  	
  	if(typeof searchtimestart!='undefined' && searchtimestart!='')
	{
		var idstart = searchtimeslot+'-'+searchtimestart;
		$('#starttime').val(idstart).change();
	}
	if(typeof searchtimeend!='undefined' && searchtimeend!='')
	{
		var idend = searchtimeslot+'-'+searchtimeend;
		$('#endtime').val(idend).change();
	}
	applysearch = true;
}
function addFileUpload(id)
{
	 // File Upload
   
    if($(id).length==0)
    	return;
    var urlfileupload = baseDir + 'modules/megaproduct/upload/';
    $(id).fileupload({
        url: urlfileupload,
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        dataType: 'json',
        /*add: function (e, data) {
        	var ext = data.files[0]['name'].split('.').pop().toLowerCase();
        	if($.inArray(ext, ['gif','png','jpg','jpeg']) == -1) {
        	    alert('invalid extension!');
        	}
        },*/
        done: function (e, data) {
        	var group = $(this).attr('data-group');
        	$('#megafield_'+group).html('');
            $.each(data.result.files, function (index, file) {
            	$('#megafieldfiles_'+group).html('');
            	if(file['error']!='')
            	{
            		 $('<p/>').text(file['error']).appendTo('#megafieldfiles_'+group);
            	}
            	if(file['type'].indexOf("image") > -1)
            	{
	            	var img = $('<img>'); //Equivalent: $(document.createElement('img'))
	            	img.attr('src', baseDir + 'modules/megaproduct/upload/files/thumbnail/'+file.name);
	            	img.appendTo('#megafieldfiles_'+group);
	                $('<p/>').text(file.name).appendTo('#megafieldfiles_'+group);
            	}
            	$('#megafield_'+group).val(file.name);
            	showStepResult();
            });
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            var group = $(this).attr('data-group');
            $('#progress'+group+' .progress-bar').css(
                'width',
                progress + '%'
            );
        }
    }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
}
function getSendGroups(quantity)
{
	var sendgroups = '';
	
	
	var resultAttrs = listAttrIds();
	
	if(resultAttrs[0]==1)
	{
		addInputValidation(resultAttrs);	
		return false;
	}
	else
	{	
		sendgroups +=resultAttrs[1];
	}
		
	var resultProducts = listProductIds(quantity);
	
	if(resultProducts[0]==1)
	{
		addInputValidation(resultProducts);
		return false;
	}
	else
	{	
		sendgroups +=resultProducts[1];
	}
	
	var resultQuantities = listQuantityIds();
	if(resultQuantities[0]==1)
	{
		addInputValidation(resultQuantities);
		return false;
	}
	else
	{	
		sendgroups +=resultQuantities[1];
	}
	sendgroups += listPersonalization();
	
	/*if(typeof mpLastStep!='undefined')
	if($('.step'+mpLastStep+'').find('#id_time_slots').length)
	{
		if(_MP.time==2 || _MP.time==3 || _MP.time==6)
		{
			if(!checkMegaTimes(true))
			{
				return false;
			}
			var loadtimes = loadTimeSlots(); 
			if(!loadtimes)
			{
				return false;	
			}
		}
		if(checkTimeSlot() && ($('#id_time_slots').val()==0 || $('#id_time_slots').val()==null))
		{
			showErrorAlert(errorInfoSelectTime);
			return false;
		}
	}*/
	
	return sendgroups;
}
function calculeservice(idProduct, idCombination, addedFromProductPage, callerElement, quantity, whishlist)
{	
	if(typeof mpOnlaunch!='undefined')
		mpOnlaunch = 1;
	
	
	if(_MP.time==2 || _MP.time==3 || _MP.time==6)
	{
		if(!checkMegaTimes(true))
		{
			return false;
		}
		var loadtimes = loadTimeSlots(); 
		if(!loadtimes)
		{
			return false;	
		}
	}
	if(checkTimeSlot() && ($('#id_time_slots').val()==0 || $('#id_time_slots').val()==null))
	{
		showErrorAlert(errorInfoSelectTime);
		return false;
	}
	

	var sendgroups = getSendGroups();
	if(sendgroups===false)
		return false;
	var dataoptions = getDataServices();
	
	$.ajax({
		type: 'POST',
		url: baseDir + 'index.php?fc=module&module=megaproduct&controller=ajaxservices',
		async: false,
		cache: false,
		dataType : "html",
		data: '&1'+dataoptions+sendgroups+'&qty=' + ((quantity && quantity != null) ? quantity : '1') + '&id_product=' + idProduct + '&token=' + static_token + ( (parseInt(idCombination) && idCombination != null) ? '&ipa=' + parseInt(idCombination): ''),
		success: function(jsonData,textStatus,jqXHR)
		{
			if(jsonData)
			{
				if(jsonData.indexOf("megaerror")>0){
					$('#calculePrice').remove();
					if($('#mpimages').length)
						$('#mpimages').append(jsonData);
					else if($('.primary_block').length)
						$('.primary_block').append(jsonData);
					else
						$('#main').append(jsonData);
					$('#calculePrice').hide();
					
					showMPInfo('#calculePriceData','','');
					
				}
				else if(_MP.modal_info==1)
				{
					if($('.primary_block').length)
						$('.primary_block').append(jsonData);
					else if($('#primary_block').length)
						$('#primary_block').append(jsonData);
					else if($('#mph-home-container'+idProduct).length)
						$('#mph-home-container'+idProduct).append(jsonData);
					else
						$('#megaproduct').append(jsonData);
					if($('#extraInfoProducts').length>0)
					{
						$('#extraInfoProducts').append(getInfoExtraProduct());
					}
					$('#our_price_display').html($('#mp-total').html());
					$('.our_price_display').show();
					if($('#mp-total-price').length)
					{
						var price = parseFloat($('#mp-total-price').val());
						if($('#old_price_display').length>0 && $('#reduction_percent_display').lenght>0)
						{
				 			var discount = $('#reduction_percent_display').html();
							 discount = discount.replace("%", "");
							 discount = discount.replace("-", "");
							 discount = _MP.priceAsFloat(discount)/100;
							 var pricedisc = price/(1-discount);
							 $('#old_price_display').html(_MP.displayPrice(pricedisc,true));
							 if($('#price_reduction_display').length)
								 $('#price_reduction_display').html(_MP.displayPrice(price-pricedisc,true));
					 	} 
					 	if($('#pretaxe_price_display').length>0)
						{
							 var pricewt = price/(1+(taxRate/100));
							 $('#pretaxe_price_display').html(_MP.displayPrice(pricewt,true)); 
						}
					}
					
					$('#calculePrice').hide();
					
					
					showMPInfo('#calculePriceData','','');
					
				}
				else
				{
					if($('#mpimages').length)
						$('#mpimages').append(jsonData).fadeIn(2000);
					else if($('.primary_block').length)
						$('.primary_block').append(jsonData).fadeIn(2000);
					else
						$('#primary_block').append(jsonData).fadeIn(2000);
					goToByScroll('calculePrice');
				}
			}
			addMPEventProduct();
		}
	});
}
function addMPEventProduct()
{
	$('#btnAddCalculeService').unbind('click').click(function(e) {
        e.preventDefault();
        if($('#id_step_quantity').length>0)
			$('#quantity_wanted').val($('#id_step_quantity').val());
			var addedFromProductPage = true;
			if($('#btnAddCalculeService').parents('body').hasClass('content_only'))
				addedFromProductPage = false;
			
			addMegaProduct( getIdProduct(), getIdCombination(), addedFromProductPage, null, $('#quantity_wanted').val(), null,false);					
       });
}
function closeMPInfo(id, closefunction)
{
	if ($(id).length && $(id).hasClass('ui-dialog-content') && $(id).dialog("isOpen")) {
		$(id).dialog('close');
	}
	if (!!$.prototype.fancybox){
	if ($('div.fancybox-opened').length)
		parent.$.fancybox.close();
	}

	
}
function showMPInfo(id,title,openfunction)
{
	if(openfunction!='')
		window[openfunction]();
	
	if (!!$.prototype.fancybox){
		 $.fancybox.open([
		        {
		            type: 'inline',
		            autoScale: true,
		            minHeight: 30,
		            content: $(id)
		        }
		    ], {
		        padding: 5
		    });
	}
	else
	{
		$(id).dialog({ 
			autoOpen: true,
	        modal: true,
	        width:'auto'});
		if(title!='')
			$(id).dialog('option', 'title', title);
	}	
}
// Funcion open dialog or fancybox to show messages
function showErrorAlert(alerta)
{
	
	if($('.mp-result-error').length)
		$('.mp-result-error').html(alerta);
	else if (!!$.prototype.fancybox){
		 $.fancybox.open([
		        {
		            type: 'inline',
		            autoScale: true,
		            minHeight: 30,
		            content: '<div class="alert alert-danger">'+alerta+'</div>'
		        }
		    ], {
		        padding: 5
		    });
	}
	else
		alert(alerta);
}
function showprice(idProduct, idCombination, addedFromProductPage, callerElement, quantity, whishlist){
	
	
		
	var sendgroups = getSendGroups();
	if(sendgroups===false)
		return false;
	if(typeof _MP.multiAvailability && _MP.multiAvailability.length>1)
		quantity = _MP.multiAvailability.length;

	dataoptions = getDataServices();
	$.ajax({
		type: 'POST',
		url: baseDir + 'index.php?fc=module&module=megaproduct&controller=ajaxservices',
		async: true,
		cache: false,
		dataType : "json",
		data: 'type=showprice'+sendgroups+dataoptions+'&qty=' + ((quantity && quantity != null) ? quantity : '1') + '&id_product=' + idProduct + '&token=' + static_token + ( (parseInt(idCombination) && idCombination != null) ? '&ipa=' + parseInt(idCombination): ''),
		success: function(jsonData,textStatus,jqXHR)
		{
			if(jsonData)
			{
				var price = jsonData['price'];
				$('.our_price_display').show();

				$('#our_price_display').html(price);
				$('.current-price span:first').html(price);
				$('.product-prices .product-price').html(price);
				if($('.mp_total_price').length)
					$('.mp_total_price').html(price);
				if(typeof jsonData['pricewtr']!='undefined')
					$('#old_price_display').html(jsonData['pricewtr']);
				if(typeof jsonData['discount']!='undefined')
					$('#reduction_amount_display').html(jsonData['discount']);
			}
		}
	});
	return true;
	
};


function goToByScroll(id){
 
    // Scroll
 if($("#"+id).length)
  $('html,body').animate({
      scrollTop: $("#"+id).offset().top},
      'slow');
};
function valueInArray(arrayValues,item)
{
	for (i = 0; i < arrayValues.length; i++)
	{
		if(arrayValues[i]==item)
			return true;
	}

	return false;
};

function listAttrIds()
{
	var sendgroups = '';
	var resultgroups= new Array();
	resultgroups[0]=0;
	resultgroups[1]='';
	resultgroups[2]= new Array();
	var totalselect = 0;
	if(typeof megaGroups!='undefined' && megaGroups.length>0)
	{
		var ids = 0;
		for (i=0; i<megaGroups.length; i++)
		{
			var totalselect = 0;
			if(typeof megaGroups[i]!='undefined' && applyStepValidation(megaGroups[i]))
			{	
				var id_group = megaGroups[i]['id_addgroup'];
				var mpgroup = megaGroups[i];
				
				if(mpgroup['type']=='0' && mpgroup['show']!='3' && !$('#megagroup'+mpgroup['id_addgroup']).hasClass('hideMegaField'))
				{
					if(mpgroup['multiselect']!=0)
					{
						mpgroup['selections'] = getMultiSelectGroup(id_group);
						totalselect = mpgroup['selections'].length;
										
						for (var j = 0; j < mpgroup['selections'].length; j++) 
						{
							if(sendgroups=='')
								sendgroups+='&attrIds=';
							if(ids>0)
								sendgroups+='-';
							
							sendgroups+=mpgroup['selections'][j];
							resultgroups[2].push(mpgroup['selections'][j]);
							
							ids++;
						}
					}
					else if(mpgroup['selected']!=0)
					{
						if($('#megagroup'+megaGroups[i]['id_addgroup']).length && !$('#megagroup'+megaGroups[i]['id_addgroup']).hasClass('hideMegaField') && mpgroup['action']!=1)
						{
							if(typeof mpgroup['selected']!='undefined' && mpgroup['selected']!='')
							{
								totalselect = 1;
								if(mpgroup['dep']=='1')
								{
									if(sendgroups=='')
										sendgroups+='&attrIds=';
									if(ids>0)
										sendgroups+='-';
									
									sendgroups+=mpgroup['selected'];
									resultgroups[2].push(mpgroup['selected']);
									ids++;
								}
							}
						}
					}
					if(mpgroup['multiselectmin']!=0 && totalselect<mpgroup['multiselectmin'] && mpOnlaunch==1 && !$('#megagroup'+megaGroups[i]['id_addgroup']).hasClass('hideMegaField'))
					{
						resultgroups[0]=1;
						resultgroups[1]= minselectiontext + ' ' +$('#megalabel_'+id_group+' .mega_title').html()+' '+mpgroup['multiselectmin'];
						resultgroups[3] = '#megalabel_'+id_group;
						resultgroups[4] = 'minqty';
						return resultgroups;
					}
					if(mpgroup['multiselectmax']!=0 && totalselect>mpgroup['multiselectmax'] && mpOnlaunch==1 && !$('#megagroup'+megaGroups[i]['id_addgroup']).hasClass('hideMegaField'))
					{
						resultgroups[0]=1;
						resultgroups[1]= maxselectiontext + ' ' +$('#megalabel_'+id_group+' .mega_title').html()+' '+mpgroup['multiselectmax'];
						resultgroups[3] = '#megalabel_'+id_group;
						resultgroups[4] = 'maxqty';
						return resultgroups;
					}
					
				}
				if(mpgroup['type']=='3' && mpgroup['required']==1 && mpOnlaunch==1 && !$('#megagroup'+megaGroups[i]['id_addgroup']).hasClass('hideMegaField'))
				{
					if(mpgroup['customquantity']==0 && $('#megafield_'+megaGroups[i]['id_addgroup']).val()=='')
					{
						resultgroups[0]=1;
						resultgroups[1]= requiredfieldtext + ' ' +$('#megalabel_'+id_group+' .mega_title').html();
						resultgroups[3] = '#megafield_'+megaGroups[i]['id_addgroup'];
						resultgroups[4] = 'required';
						return resultgroups;
					}
					else if(mpgroup['customquantity']==1 || _MP.quantityGroups!=0)
					{
						var qty = parseInt($('#id_step_quantity').val());
						if(_MP.quantityGroups!=0)
						qty = _MP.quantityGroups;
					
						for(k=0;k<qty;k++) 
						{
							if($('#megafield_'+megaGroups[i]['id_addgroup']+'_'+k).val()=='')
							{
								
								$('#mpTab'+k).click();
								$('#megafield_'+megaGroups[i]['id_addgroup']+'_'+k).focus();
								var x = k+1;
								resultgroups[0]=1;
								resultgroups[1]= requiredfieldtext + ' ' + $('#megagroup'+id_group+' .custom_title').html()+ ' (' + x +')';
								return resultgroups;
							}
						}
					}
					
				}
			}
		}
	
	}
	resultgroups[1] = sendgroups;
	return resultgroups;
};
function getAttrSelectedId(id_group)
{
	if($('#group_'+id_group).length>0)
	{
		return $('#group_'+id_group).val();
	}
	else if($('#color_pick_hidden[name="group_'+id_group+'"]').length>0)
	{
		return $('#color_pick_hidden[name="group_'+id_group+'"]').val();
	}
	else if($('.color_pick_hidden[name="group_'+id_group+'"]').length>0)
	{
		return $('.color_pick_hidden[name="group_'+id_group+'"]').val();
	}

	return 0;
};
function getFisrtAttrSelectedId(id_group)
{
	var idAttr = 0;
	if($('#megagroup'+id_group+' li:first').length>0)
	{
		idAttr = $('#megagroup'+id_group+' li:first').attr('alt');
	}
	else if($('#megafield_'+id_group+' option:not([disabled])').length>0)
	{
		idAttr = $('#megafield_'+id_group+' option:not([disabled])').first().attr('value');
	}
	else if($('#megafield_'+id_group).length>0)
	{
		idAttr = $('#megafield_'+id_group).val();
	}
	
	return idAttr;
}
function listQuantityIds()
{
	var sendgroups='';
	var resultgroups= new Array();
	var separateIds = '';
	resultgroups[0]=0;
	resultgroups[1]='';
	resultgroups[2]= new Array();
	if(typeof megaGroups!='undefined' && megaGroups.length>0)
	{
		var ids = 0;
		var idsep = 0;
		var separateIds = '';
		var activeMulti = false;
		var totalGroups = 0;
		var totalOtherGroups = 0;
		var maxlimit = 0;
		var minlimit = 0;
		var minOtherGroups = 0;
		var minOtherGroupId = 0;
		var minOtherTitleGroup = '';
		var minOtherIdsGroup = '';
		var arrayMinOthers = new Array();
		var arrayQtyGroups = new Array();
		for (i=0; i<megaGroups.length; i++)
		{
			var id_group = megaGroups[i]['id_addgroup'];
			var mpgroup = megaGroups[i];
			if(mpgroup!=null)
			{		
				if(applyStepValidation(megaGroups[i]) && mpgroup['type']=='0' && mpgroup['show']==3 && !$('#megagroup'+mpgroup['id_addgroup']).hasClass('hideMegaField'))
				{
					var totalqty = 0;
					$('#megagroup'+mpgroup['id_addgroup']+' .mega-qty-list').each(function(){
						var id = $(this).attr('data-attr');
						var qty = $(this).val();
						if(qty!=0)
						{
							totalqty += parseInt(qty);
							if(mpgroup['limit']==1)
							{
								if($('#qty-label-'+id).length>0 && mpgroup['multiselectmin']!=0 && qty<mpgroup['multiselectmin'] && mpOnlaunch==1)
								{
									resultgroups[0]=1;
									resultgroups[1]= minselectiontext + ' ' +$('#qty-label-'+id).html()+' '+mpgroup['multiselectmin'];
									resultgroups[3] = '#megagroup'+mpgroup['id_addgroup'];
									resultgroups[4] = 'limitqty';
								}
								if($('#qty-label-'+id).length>0 && mpgroup['multiselectmax']!=0 && qty>mpgroup['multiselectmax'] && mpOnlaunch==1)
								{
									resultgroups[0]=1;
									resultgroups[1]= maxselectiontext + ' ' +$('#qty-label-'+id).html()+' '+mpgroup['multiselectmax'];
									resultgroups[3] = '#megagroup'+mpgroup['id_addgroup'];
									resultgroups[4] = 'limitqty';
								}
							}
							if(mpgroup['action']==4)
							{
								if(separateIds=='')
									separateIds+='&separateIds=';
								if(idsep>0)
									separateIds+='-';
								separateIds+=id+'|'+qty;
								idsep++;
							}
							else
							{
								if(ids==0 && sendgroups=='')
									sendgroups+='&quantityIds=';
										
								if(ids>0)
									sendgroups+='-';
								sendgroups+=id+'|'+qty+'|'+mpgroup['id_addgroup']+'|'+mpgroup['grouplimitattr']+'|'+mpgroup['action'];
								ids++;
							}
						}
							
						
					});
					if(mpgroup['action']==3 && mpOnlaunch==1)
					{
						var qtycart = parseInt($('#quantity_wanted').val());
						if(totalqty!=qtycart)
						{
							resultgroups[0]=1;
							resultgroups[1]= samequantitytext + ' ' +$('#megalabel_'+id_group+' .mega_title').html();
							resultgroups[3] = '#megagroup'+mpgroup['id_addgroup'];
							resultgroups[4] = 'limitqty';
						}	
					}
					if(mpgroup['limit']==0)
					{
						if($('#megagroup'+mpgroup['id_addgroup']+' .mega_title').length>0 && mpgroup['multiselectmin']!=0 && totalqty<mpgroup['multiselectmin'] && mpOnlaunch==1)
						{
							resultgroups[0]=1;
							resultgroups[1]= minselectiontext + ' ' +$('#megagroup'+mpgroup['id_addgroup']+' .mega_title').html()+' '+mpgroup['multiselectmin'];
							resultgroups[3] = '#megagroup'+mpgroup['id_addgroup'];
							resultgroups[4] = 'limitqty';
							
						}
						if($('#megagroup'+mpgroup['id_addgroup']+' .mega_title').length>0 && mpgroup['multiselectmax']!=0 && totalqty>mpgroup['multiselectmax'] && mpOnlaunch==1)
						{
							resultgroups[0]=1;
							resultgroups[1]= maxselectiontext + ' ' +$('#megagroup'+mpgroup['id_addgroup']+' .mega_title').html()+' '+mpgroup['multiselectmax'];
							resultgroups[3] = '#megagroup'+mpgroup['id_addgroup'];
							resultgroups[4] = 'limitqty';
						}
					}
					if(mpgroup['limit']==2)
					{
						totalGroups += totalqty;
						
						activeMulti = true;
						maxlimit = mpgroup['multiselectmax'];
						minlimit = mpgroup['multiselectmin'];
					}
					if(mpgroup['limit']!=3)
					{
						if(typeof arrayQtyGroups[mpgroup['id_addgroup']]=='undefined')
							arrayQtyGroups[mpgroup['id_addgroup']] = 0;
						arrayQtyGroups[mpgroup['id_addgroup']] += totalqty;
						totalOtherGroups += totalqty;
						
					}
					if(mpgroup['limit']==3)
					{
						minOtherGroups += totalqty;
						arrayMinOthers.push({id_addgroup: mpgroup['id_addgroup'],qty: totalqty,  ids: mpgroup['grouplimitids'], title:  $('#megagroup'+mpgroup['id_addgroup']+' .mega_title').html()});
					
					}
				}
			}
		}
		if(activeMulti)
		{
			if(minlimit!=0 && totalGroups<minlimit && mpOnlaunch==1)
			{
				resultgroups[0]=1;
				resultgroups[1]= minselectiontext + ' '+minlimit;			
			}
			if(maxlimit!=0 && totalGroups>maxlimit && mpOnlaunch==1)
			{
				resultgroups[0]=1;
				resultgroups[1]= maxselectiontext +' '+maxlimit;	
			}
		}
		if(arrayMinOthers.length!=0 && mpOnlaunch==1)
		{
			for(var n=0;n<arrayMinOthers.length;n++)
			{
				minOtherIdsGroup=arrayMinOthers[n]['ids'];
				//minOtherGroups = arrayMinOthers[n]['qty'];
				minOtherGroupId = arrayMinOthers[n]['id_addgroup'];
				minOtherTitleGroup = arrayMinOthers[n]['title'];
			
				if(minOtherIdsGroup!='')
				{
					totalOtherGroups = 0;
				
					var arrayIds = minOtherIdsGroup.split(',');
					for(var k=0;k<arrayIds.length;k++)
					{
						var id = parseInt(arrayIds[k]);
						if(typeof arrayQtyGroups[id]!='undefined')
							totalOtherGroups += parseInt(arrayQtyGroups[id]);
					}
				}
				if(minOtherGroups>totalOtherGroups)
				{
				
					resultgroups[0]=1;
					if($('#megadescriptionlong_'+minOtherGroupId).length && $('#megadescriptionlong_'+minOtherGroupId).html()!=''){
						resultgroups[1]= $('#megadescriptionlong_'+minOtherGroupId).html();
					} else {
						resultgroups[1]= minOtherTitleGroup+' => '+ maxquantitytext +' :'+minOtherGroups;
					}
					mpOnlaunch = 0;
					break;
				}
			
			}
				
			
		}
	}
	if(resultgroups[1]=='')
		resultgroups[1] = sendgroups+separateIds;
	return resultgroups;
};
function listCombinationIds()
{
	var sendgroups='';
	if(typeof megaGroups!='undefined' && megaGroups.length>0)
	{
		var ids = 0;
		for (i=0; i<megaGroups.length; i++)
		{
			var id_group = megaGroups[i]['id_group'];
			var mpgroup = megaGroups[i];
			if(mpgroup!=null)
			{		
				if(mpgroup['type']=='0' && mpgroup['show']==3)
				{		
					$('#mp-attrqty-'+id_group+' input').each(function(){
						var id = $(this).attr('id').substring(7);
						var choice = new Array();
						if($(this).val()!=0)
						{
							
							for (j=0; j<megaGroups.length; j++)
							{
								var idGroup = megaGroups[j]['id_group'];
								if(idGroup!=id_group)
									choice.push(getAttrSelectedId(idGroup));
								else
									choice.push(id);
							}
							var idCombination = findMPCombination(choice,$(this).val());
							if(idCombination!=0)
							{
								if(ids==0 && sendgroups=='')
									sendgroups+='&combinationIds=';
								
								if(ids>0)
									sendgroups+='-';
								sendgroups+=idCombination+'|'+$(this).val();
								ids++;
							}
						}
					});
				}
			}
		}
	}
	return sendgroups;
};
function findMPCombination(choice,quantity)
{
	
	
	//testing every combination to find the conbination's attributes' case of the user
	for (var combination = 0; combination < combinations.length; ++combination)
	{
		//verify if this combinaison is the same that the user's choice
		var combinationMatchForm = true;
		$.each(combinations[combination]['idsAttributes'], function(key, value)
		{
			if (!in_array(value, choice))
			{
				combinationMatchForm = false;
			}
		});
		if (combinationMatchForm)
		{
			
			var idCombinationQty = combinations[combination]['quantity'];
			if(idCombinationQty>quantity)
				return combinations[combination]['idCombination'];

		//	var idCustomization = combinations[combination]['idCombination'];
			//get the data of product with these attributes
			
		}
	}
	return 0;
}
function getInfoExtraProduct()
{
	var textInfo='';
	if(typeof megaGroups!='undefined' && megaGroups.length>0)
	{
		var ids = 0;
		for (i=0; i<megaGroups.length; i++)
		{
			
			var id_group = megaGroups[i]['id_addgroup'];
			var mpgroup = megaGroups[i];
			if(mpgroup!=null)
			{		
				if(mpgroup['type']=='1')
				{
					var html =$('#megalabel_'+id_group).html();
					//$html.remove(".divmegazoom");
					textInfo +=  html +'<br/>';
				}
			}
		}
	}
	return textInfo;
}
function listPersonalization()
{
	var sendgroups = '';
	var customgroups= new Array();
	
	if(typeof megaGroups!='undefined' && megaGroups.length>0)
	{
		for (i=0; i<megaGroups.length; i++)
		{	
			var id_group = megaGroups[i]['id_addgroup'];
			var mpgroup = megaGroups[i];
			if(mpgroup!=null)
			{		
				if(applyStepValidation(megaGroups[i]) && mpgroup['type']=='3' && !$('#megagroup'+id_group).hasClass('hideMegaField'))
				{
					customgroups.push(mpgroup['id_addgroup']);
					if(mpgroup['customquantity']==0 || _MP.quantityGroups==0)
					{
						if(mpgroup['id_group']=='3')
						{
							customgroups.push(parseFloat($('#megafield_'+mpgroup['id_addgroup']).val()));
						}
						else
							customgroups.push($('#megafield_'+mpgroup['id_addgroup']).val());
					}
					else
					{
						var qty = parseInt($('#id_step_quantity').val());
						if(_MP.quantityGroups!=0)
							qty = _MP.quantityGroups;
						var multicustom = '';
						for(var k=0;k<qty;k++)
						{
							if(multicustom!='')
								multicustom+='|';
							multicustom += $('#megafield_'+mpgroup['id_addgroup']+'_'+k).val();
						}
						customgroups.push(multicustom);
					}
				}	
			}
		}
	}
	if(customgroups.length)
	{
		return '&personalization='+encodeURIComponent(JSON.stringify(customgroups));
	}	
	return '';
};
function listProductIds(quantity)
{
	var sendgroups = '';
	var resultgroups= new Array();
	resultgroups[0]=0;
	if(typeof megaGroups!='undefined' && megaGroups.length>0)
	{
		var ids = 0;
		for (i=0; i<megaGroups.length; i++)
		{
			
			var id_group = megaGroups[i]['id_addgroup'];
			var mpgroup = megaGroups[i];
			if(mpgroup!=null)
			{		
				if(mpgroup['type']=='1')
				{
					if(sendgroups=='')
						sendgroups+='&productIds=';
					
					if(mpgroup['show']!=3)
					{
						var totalselect = 0;
						if(typeof mpgroup['selected']!='undefined' && mpgroup['selected']!=0 && mpgroup['selected']!='' && mpgroup['multiselect']==0)
						{
							if(ids>0)
								sendgroups+='-';
							
							sendgroups+=mpgroup['selected']+'|1';
							ids++;
							totalselect = 1;
						}
						if(mpgroup['multiselect']!=0)
						{
							mpgroup['selections'] = getMultiSelectGroup(id_group);
							totalselect = mpgroup['selections'].length;
							
							for (var j = 0; j < mpgroup['selections'].length; j++) 
							{
								if(ids>0)
									sendgroups+='-';
								
								sendgroups+=mpgroup['selections'][j]+'|1';
								ids++;
							}
						}
						if(mpgroup['multiselectmin']!=0 && totalselect<mpgroup['multiselectmin'] && mpOnlaunch==1)
						{
							resultgroups[0]=1;
							resultgroups[1]= minselectiontext + ' ' +$('#megalabel_'+id_group+' .mega_title').html()+' '+mpgroup['multiselectmin'];
							resultgroups[3] = '#megagroup'+mpgroup['id_addgroup'];
							resultgroups[4] = 'limitqty';
							return resultgroups;
						}
						if(mpgroup['multiselectmax']!=0 && totalselect>mpgroup['multiselectmax'] && mpOnlaunch==1)
						{
							resultgroups[0]=1;
							resultgroups[1]= maxselectiontext + ' ' +$('#megalabel_'+id_group+' .mega_title').html()+' '+mpgroup['multiselectmax'];
							resultgroups[3] = '#megagroup'+mpgroup['id_addgroup'];
							resultgroups[4] = 'limitqty';
							return resultgroups;
						}
					}
					else
					{
						$('#megafield_'+mpgroup['id_addgroup']+' input').each(function(){
							var id = $(this).attr('id').substring(12);
							if($(this).val()!=0)
							{
								if(ids>0)
									sendgroups+='-';
								sendgroups+=id+'|'+$(this).val();
								ids++;
							}
						});
						
					}
						
					
				}	
			}
		}
	
	}
	resultgroups[1] = sendgroups;
	return resultgroups;
};
function showMegaHelp(id_group, type)
{
	if(type==0)
	{
	
	$('#megadescriptionlong_'+id_group).animate(0, 1000, function() {
        $(this).toggle();
     });
	}
	else
	{
		var contentHelp = '';
		var title = '';
		
		if($('#megadescriptionlong_'+id_group).length)
			contentHelp += $('#megadescriptionlong_'+id_group).html()+'<br/>';
		
		$('#helpmegaproduct').html(contentHelp);
		$('#helpmegaproduct').attr('title',title);
		if(contentHelp!='')
		{
			showMPInfo('#helpmegaproduct',title,'');	
		}
		
	}
	
	 return false;
	
};
function showMegaAttrHelp(id_addattr,id_addgroup)
{
	
		var contentHelp = '';
		var title = '';
		if($('#megadescattr_'+id_addattr).length)
		{
			contentHelp += $('#megadescattr_'+id_addattr).html()+'<br/>';
			title = $('#megadescattr_'+id_addattr).attr('title');
		}
		
		var id = '#megaattrhelp_'+id_addattr;
		if(id_addgroup!=0)
		{
			id = '#megaattrhelp_'+id_addgroup;
		}
		if(contentHelp=='')
			return false;

		$('#helpmegaproduct').html(contentHelp);
		$('#helpmegaproduct').attr('title',title);
		if(contentHelp!='')
		{
			showMPInfo('#helpmegaproduct',title,'');
			
		
		}
		
	
	
	 return false;
	
};
function zoomMegaImage(id_group)
{
	var id = '#megaImageList_'+id_group+' .selectAttr';
	$('#megazoom_'+id_group).attr('href',$(id).attr('alt'));
	
		$('#megazoom_'+id_group).fancybox({
		'autoSize' : false,
		'width' : 600,
		'height' : 'auto',
		'hideOnContentClick': true
		}); 
	$('#megazoom_'+id_group).trigger('click');
	return false;
	
}

function updateMegaProduct(id_group,id_product)
{
	mpgroup = getMegaGroupById(id_group);
	if(mpgroup!=null)
	{
		var megafield =  getMegaField(mpgroup,id_group,id_product);

	
		if(mpgroup['selected']==id_product)
		{
			removeMegaSelect(mpgroup,id_product);
			showStepResult();
			return true;
		}
			
		changeOptionSelected(megafield);
		var arrayAttr = new Array();
		if($.isArray(id_product))
		{
			arrayAttr = id_product;
		}
		else
		{
			arrayAttr[0]=id_product;
		}
	
		changeTitleSelected(mpgroup,id_group,arrayAttr);
		changeImageSelected(mpgroup,id_group,id_product);
		mpgroup['selected']=id_product;

	}
	showStepResult();
}
function updateMegaProductSelect(id_group)
{
	mpgroup = getMegaGroupById(id_group);
	if(mpgroup!=null)
	{
		var id_attribute = $('#megafield_'+id_group).val();
		if(id_attribute.length>1)
		{
			mpgroup['selections']=id_attribute;
			//$('#megaName_'+id_group).html('');
			$('#imageDivGroup_'+id_group).hide();
			//return;
		}
		
		if(mpgroup['show']=='4')
		{
			id_attribute = $('#megagroups input:radio[name=megafield_'+id_group+']:checked').val();
		}
		var arrayAttr = new Array();
		if($.isArray(id_attribute))
		{
			arrayAttr = id_attribute;
		}
		else
		{
			arrayAttr[0]=id_attribute;
		}
		changeTitleSelected(mpgroup,id_group,arrayAttr);
		changeImageSelected(mpgroup,id_group,id_attribute);
		
		
		mpgroup['selected']=id_attribute;

	}
	showStepResult();	
}
function getMegaField(mpgroup,id_group,id_attribute)
{
	var megafield = null;
	if(mpgroup['show']=='0')
	{
		megafield = $('#megafield_'+id_group+' option:selected');
	}	
	/*else if(mpgroup['show']=='4')
	{
		megafield = $('#megagroups input:radio[name=megafield_'+id_group+']');
	}*/
	else
	{
		megafield = $('#megagroups #megafield_'+id_group+'_'+id_attribute);
	}
	if(mpgroup['multiselect']=='1' && $('[name=mpcheckbox_'+id_group+'_'+id_attribute+']').length){
		megafield = $('[name=mpcheckbox_'+id_group+'_'+id_attribute+']');
	}
	return megafield;
}
function changeImageSelected(mpgroup,id_group, id_attribute)
{
	if(id_attribute!=null && id_attribute.length>1)
	{
		$('#imageDivGroup_'+id_group).hide();
		return;
	}
		
	$('#imageDivGroup_'+id_group).show();
	var megafield = getMegaField(mpgroup,id_group,id_attribute);
	if(mpgroup['show']=='0')
	{
		if($('#megafield_'+id_group+' option:selected').length>0 && $('#imageGroup_'+id_group).length>0)
		{
			$('#imageGroup_'+id_group).attr('src',$(megafield).attr('alt'));
			$('#imageGroupLink_'+id_group).attr('href',$(megafield).attr('alt'));
		}
	}
	else
	{
		if($('#imageGroup_'+id_group).length>0)
		{
			$('#imageGroup_'+id_group).attr('src',$(megafield).attr('alt'));
			$('#imageGroupLink_'+id_group).attr('href',$(megafield).attr('alt'));
		}
	}
	if(id_attribute==0)
	{
		$('#imageDivGroup_'+id_group).hide();
	}
}
function changeOptionSelected(megafield)
{
	$(megafield).parents('ul:first').find('a').each(function(){
		$(this).removeClass('selectAttr');
	});
	$(megafield).addClass('selectAttr');
}
function changeTitleSelected(mpgroup,id_group,attributes)
{
	if(mpgroup['type']=='7')
		return false;
	var megatitle = '';
	
	var megaweight = 0;
	
	if(attributes==null)
		return;
	
	for(var k=0;k<attributes.length;k++)
	{
		if(megatitle!='')
			megatitle += ' - ';
	
		if(mpgroup['show']=='0')
		{
			megatitle += $('#megagroups #megafield_'+id_group+' option[value="' + attributes[k] + '"]').html();
		}
		else if(mpgroup['show']=='4' && mpgroup['multiselect']=='0')
		{
			megatitle += $('#megagroups input:radio[name=megafield_'+id_group+']:checked').attr('title');
			
		}
		else if(mpgroup['show']=='4' && mpgroup['multiselect']=='1')
		{
			megatitle += $('[for=mpcheckbox_'+id_group+'_'+attributes[k]+']').text();
			
		}
		else
		{
			var megafield = getMegaField(mpgroup,id_group,attributes[k]);
			megatitle += $(megafield).attr('title');
		}
	}
	$('#megaName_'+id_group).html(megatitle);
	if(typeof megatitle!='undefined')
		mpgroup['selectedname'] = megatitle;
	else
	{
		$('#megaName_'+id_group).html('');
		mpgroup['selectedname'] = '';
	}
	//showStepResult();
};
function getMegaGroupById(id_group)
{
	if(typeof megaGroups!='undefined' && megaGroups.length>0)
	{
		for (i=0; i< megaGroups.length; i++)
		{
			if(megaGroups[i]['id_addgroup']==id_group)
				return megaGroups[i];
		}
	}
	return null;
}

function updateMPProductSelect(id_group)
{
	mpgroup = getMegaGroupById(id_group);
	if(mpgroup!=null)
	{
		var id_attribute = $('#megafield_'+id_group).val();
		if(mpgroup['show']=='4')
		{
			id_attribute = $('#megagroups input:radio[name=megafield_'+id_group+']:checked').val();
		}
		
		changeTitleSelected(mpgroup,id_group,id_attribute);
		changeImageSelected(mpgroup,id_group,id_attribute);
		
		mpgroup['selected']=id_attribute;
		showStepResult();
	}
	
	
}
function findMegaCombination(id_group)
{
	//_MP.changePrice();
	id_attribute = $('#megagroup_'+id_group).val();
	updateMegaAttrSelect(id_group,id_attribute);
};
function findMegaCombo(id_group)
{
	id_attribute = $('#megafield_'+id_group).val();
	$('#group_'+id_group).val(id_attribute);
	//$('#group_'+id_group).change();
	updateMegaAttrSelect(id_group,id_attribute);
};

function getMPGroupById(id_group)
{
	if(typeof megaGroups!='undefined' && megaGroups.length>0)
	{
		for (i=0; i< megaGroups.length; i++)
		{
			if(megaGroups[i]['id_addgroup']==id_group)
				return megaGroups[i];
		}
	}
	return null;
}
function removeMegaSelect(mpgroup,id_attribute)
{
	var id_addgroup = mpgroup['id_addgroup']; 
	$('#megafield_'+id_addgroup+'_'+id_attribute).removeClass('selectAttr');
	if ($('#megafield_'+id_addgroup+'_'+id_attribute).is(':radio')) {
		$('#megafield_'+id_addgroup+'_'+id_attribute).attr('checked', false);
		$('#megafield_'+id_addgroup+'_'+id_attribute).parent().removeClass('checked');
	}
	

	$('#megaName_'+id_addgroup).html('');
	mpgroup['selected'] = '';
	mpgroup['weight'] = 0;
	
}
function updateMegaAttrSelect(id_group,id_attribute)
{
	mpgroup = getMegaGroupById(id_group);
	
	if(mpgroup==null)
	 return true;
	
	if(mpgroup['selected']==id_attribute && mpgroup['dep']==1)
	{
		removeMegaSelect(mpgroup,id_attribute);
		showStepResult();
		return true;
	}
	
	var id_megagroup = $('#id_megagroup'+id_group).val();
	
	var megafield =  getMegaField(mpgroup,id_group,id_attribute);
	
	
	if($(megafield).find('img').length>0)
	{
		$('#megazoomimg_'+id_group).show();
	}
	else
	{
		$('#megazoomimg_'+id_group).hide();
	}
	changeOptionSelected(megafield);
	
	var arrayAttr = new Array();	
	arrayAttr[0] = id_attribute;
	changeTitleSelected(mpgroup,id_group,arrayAttr);
	changeImageSelected(mpgroup,id_group,id_attribute);
	
	
	if(mpgroup['dep']=='0')
	{
	
		setAttrSelectedId(id_megagroup,id_attribute);
		//if(typeof productHasAttributes!='undefined' && productHasAttributes)
		//{
			if($('#group_'+id_megagroup).length>0)
			{
				$('#group_'+id_megagroup).change();
			}
			else if($('#color_'+id_attribute).length>0)
			{
				$('#color_'+id_attribute).click();
				setAttrSelectedId(id_megagroup,id_attribute);
			}
		//}
	}
	
	mpgroup['selected'] = id_attribute;
	
	showStepResult();
	
};
function setAttrSelectedId(id_group,value)
{
	if($('#group_'+id_group).length>0)
	{
		$('#group_'+id_group).val(value);
	}
	else if($('#color_pick_hidden[name="group_'+id_group+'"]').length>0)
	{
		$('#color_pick_hidden[name="group_'+id_group+'"]').val(value);
	}
	else if($('.color_pick_hidden[name="group_'+id_group+'"]').length>0)
	{
		$('.color_pick_hidden[name="group_'+id_group+'"]').val(value);
	}
	
	return 0;
}
function stepCalculeMegaGroups(id_step)
{
	
	if($('#id_step_quantity').length>0)
		$('#quantity_wanted').val($('#id_step_quantity').val());
	/*if($('#btnCalculeService').length>0)
	{
		$('#btnCalculeService').click();
	}*/
	if($('#btnAddProduct').length>0)
	{
		$('#btnAddProduct').click();
	}
	else if($('#btnAddCalculeService').length>0)
	{
		$('#btnAddCalculeService').click();
	}
	
	
	
};
// ** STEP FUNCTIONS **/
function stepBreadCrumbs(id_step)
{
	if(id_step<=mpMaxStep){
		mpIdStep = id_step;
		stepMegaGroups(id_step);
	}
		
}
function applyStepValidation(megaGroup)
{
		if(mpIdStep==mpSteps)
		return true;

	if(typeof mpSteps=='undefined' || mpSteps<2 || mpLastStep==0)
		return true;
	
	var step = parseInt(megaGroup['step']);
	
	if(mpLastStep==step)
		return true;
	return false;
}
function stepNextMegaGroups()
{
	var id = parseInt(mpIdStep)+1;
	mpIdStep = id;
	if(typeof mpOnlaunch!='undefined')
		mpOnlaunch = 1;

	stepMegaGroups(id);
	 
};
function stepPreviousMegaGroups()
{
	var id = parseInt(mpIdStep)-1;
	mpIdStep = id;
	stepMegaGroups(id);
};

function stepMegaGroups(id_step)
{
	if(mpIdStep>mpLastStep && getSendGroups()===false)
	{
		mpIdStep = mpLastStep;
		return false;
		
	}
		
	if(id_step>mpSteps)
	{
		mpIdStep = 1;
		id_step=1;
	}
	if(id_step >=mpMaxStep)
		mpMaxStep = id_step;
	
	$('.mpstep').hide();
	$('.megacombo_step').hide();
	$('.step'+id_step).show();
	//$('#mp-step-result').hide();
	$('#mpStepPrevious').hide();
	//$('#mpStepNext').hide();
	if(id_step==1)
	{
		$('#mpStepNext').show();
	}
	else
	{
		$('#mpStepNext').show();
		$('#mpStepPrevious').show();
	}
	if(id_step==mpSteps)
	{
		$('#mpStepNext').hide();
		$('#mp-step-result').show();
		showStepResult();
	}
	mpLastStep = id_step; 
	if($('.mp-breadcrumb').length)
	{
		if($('.mp-breadcrumb-select').length)
			$('.mp-breadcrumb-select').removeClass('mp-breadcrumb-select');
		if($('#mpbreadcrumb'+id_step).length)
			$('#mpbreadcrumb'+id_step).addClass('mp-breadcrumb-select');
	}
	//$('#quantity_wanted').parent().hide();
}
function checkActionQuantities()
{
	_MP.quantityGroups = 0;
	if(typeof megaGroups!='undefined' && megaGroups.length>0 )
	{
		var totalqty = 0;
		var changeQty = false;
		for (k=0; k<megaGroups.length; k++)
		{
			if(typeof megaGroups[k]!='undefined' )
			{
				var mpgroup = megaGroups[k];
				var id_addgroup = megaGroups[k]['id_addgroup'];
				if(mpgroup['show']=='3' && (mpgroup['action']=='2' || mpgroup['action']=='4'))
				{
					var qty = 0;
					$('#megagroup'+id_addgroup+' .mega-qty-list').each(function(){
						qty += parseInt($(this).val());
					});
					totalqty +=qty;
					changeQty = true;
						
				}
				if(mpgroup['show']=='3' && mpgroup['groupquantity']=='1')
				{
					$('#megagroup'+id_addgroup+' .mega-qty-list').each(function(){
						_MP.quantityGroups += parseInt($(this).val());
					});
				}
					
				
			}
		}
		if(changeQty)
		{
			if(totalqty==0)
				totalqty=1;	
			$('#quantity_wanted').val(totalqty);
			if($('#id_step_quantity').length)
				$('#id_step_quantity').val(totalqty);
		}
	}
}
function selectMultiTab(tab)
{
	$('.mpCustomTab').hide();
	$('#mp-custom-'+tab).fadeIn('slow');
	
}
function showMultiPersonalization()
{
	if(typeof megaGroups!='undefined' && megaGroups.length>0 )
	{
		if(typeof fileupload!='undefined')
		$('#multi-personalization .fileupload').fileupload('destroy');
		var qty = 0;
		if($('#id_step_quantity').length)
			qty = parseInt($('#id_step_quantity').val());
		else
			qty = parseInt($('#quantity_wanted').val());
		if(_MP.quantityGroups>0)
			qty = qty*_MP.quantityGroups;
		
		if(_MP.lastPersonalization==qty)
			return;
		_MP.lastPersonalization=qty;
		multiqty = qty; 
		$('#mpCustomTabs').html('');
		$('#mpCustomContent').html('');
		for(var i=0;i<qty;i++)
		{
			var active = '';
			if(i==0)
				active='active';
			var k = i+1;
			var $customgroup = null;
			
			$('#mpCustomTabs').append('<li class="'+active+'"><a id="mpTab'+i+'" onclick="selectMultiTab('+i+')" href="#'+i+'a" data-toggle="tab"> - '+k+' - </a></li>');
			
			$customgroup = $('<div id="mp-custom-'+i+'" class="tap-pane mpCustomTab box"></div>');
			
			for (k=0; k<megaGroups.length; k++)
			{
				megagroup =  megaGroups[k];
				
				if(typeof megagroup!='undefined' && megagroup['type']=='3' && megagroup['customquantity']=='1')
				{
					$('#multi-personalization').show();
				
				//	if($customgroup==null)
					//	$customgroup = $('<div id="mp-custom-'+qty+'" class="box"></div>');
					
					var customtype =  megagroup['id_group'];
					var id_addgroup =  megagroup['id_addgroup'];
					
					if($('#megagroup'+id_addgroup).length && $('#megagroup'+id_addgroup).hasClass('hideMegaField'))
						continue;
					
					var required = '';
					if(megagroup['required']==1)
						required = ' required';
					$('<label>'+$('#megagroup'+id_addgroup+' .custom_title').html()+'</label>').appendTo($customgroup);
					
					var id = id_addgroup + '_' + i;
					if(customtype==0)
					{		
						$('<div class="mp-personalization"><input type="text" id="megafield_'+id+'" class="mega-input" value=""  '+required+' /></div>').appendTo($customgroup);
					}
					else if(customtype==1)
					{		
						$('<div class="mp-personalization"><textarea id="megafield_'+id+'" class="mega-input mp-personalization" value=""  '+required+' /></div>').appendTo($customgroup);
					}
					else if(customtype==2)
					{	
						$('#megafield_'+id_addgroup).parents('.mpstep').addClass('hideMegaField');
						$('<div class="mp-personalization"><select id="megafield_'+id+'" name="megafield_'+id+'">'+$('#megafield_'+id_addgroup).html()+'</select></div>').appendTo($customgroup);	
					
						
					}
					else if(customtype==5)
					{
						$('<input id="fileupload'+id+'" data-group="'+id+'" data-name="'+id+'" class="fileupload" type="file" name="files[]"><br><div id="progress'+id+'" class="progress"><div class="progress-bar progress-bar-success"></div></div><input type="hidden" id="megafield_'+id+'" class="mega-input" type="text" value=""><div id="megafieldfiles_'+id+'" class="files"></div>').appendTo($customgroup);			
					}
					else if(customtype==6)
					{
						$('<div class="mp-personalization"><input id="megafield_'+id+'" class="mega-input mp-custom-calendar" style="text-align:center;" type="text" value=""></div>').appendTo($customgroup);			
					}
					
				}
			}
			$('#mpCustomContent').append($customgroup).fadeIn('slow');
			
		}
		$('.mp-custom-calendar').datepicker({dateFormat: "dd-mm-yy"});
		$('.mpCustomTab').hide();
		$('.mpCustomTab:first').show();
		addFileUpload('#multi-personalization .fileupload');
		if (typeof uniform != "undefined") 
		{
			$('#multi-personalization input[type="file"]').uniform();
		}
	}
}
function parseMPDate(input, format) {
  format = format || 'yyyy-mm-dd'; // default format
  var parts = input.match(/(\d+)/g), 
      i = 0, fmt = {};
  // extract date-part indexes from the format
  format.replace(/(yyyy|dd|mm)/g, function(part) { fmt[part] = i++; });

  return new Date(parts[fmt['yyyy']], parts[fmt['mm']]-1, parts[fmt['dd']]);
}
function applyDefaultDate()
{
	if(typeof _MP.attrDefaultDates!='undefined' && _MP.attrDefaultDates.length)
	{
		var listAttrIds = getAllIds();
		
		for(var i=0;i<_MP.attrDefaultDates.length;i++)
		{
				var attrs = _MP.attrDefaultDates[i]['attributes'];
				var date_start = _MP.attrDefaultDates[i]['date_start'];
				var date_end = _MP.attrDefaultDates[i]['date_end'];
				if(typeof attrs!='undefined' && attrs!='')
				{
					attrs = attrs.split("-");
					var newArray = new Array();
					for(var j=0;j<attrs.length;j++)
					{
						attrs[j] = parseInt(attrs[j]);
						if(attrs[j]!=0)
							newArray.push(attrs[j]);
					}
					attrs = newArray;
				}
				else
					attrs = new Array();
				if(typeof attrs!='undefined')
				{
					var apply = true;
											
					if(attrs.length)
					for(var j=0;j<attrs.length;j++)
					{
						var id = parseInt(attrs[j]);
						if(apply && $.inArray(id,listAttrIds)<0)
							apply= false;
					}
					if(apply)
					{
						if($('#id_date_start').length)
						{
							$('#id_date_start').datepicker("setDate", new Date(date_start));
							_MP.date_start = $('#id_date_start').datepicker("getDate");	
						}
						else
						{
							_MP.date_start = parseMPDate(date_start, 'yyyy-mm-dd');
						}
						if(date_end!='')
						{
							if($('#id_date_end').length)
								$('#id_date_end').datepicker("setDate", new Date(date_end));
					
							var date1 = parseMPDate(date_start, 'yyyy-mm-dd');
							var date2 = parseMPDate(date_end, 'yyyy-mm-dd');
							var timeDiff = Math.abs(date2.getTime() - date1.getTime());
							var diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
							_MP.days = diffDays;
						}
						 
					}
				}
			}
	}
	if(checkTimeSlot())
		loadTimeSlots();
	
}
function getAllIds()
{
	var ids = new Array();
	var groupIds = listAttrIds();
	
	if(typeof groupIds[2]!='undefined')
	{
		ids = groupIds[2];
	}
		
	
	var idComb =  getIdCombination();
	
	if (typeof combinations == 'undefined' || !combinations)
		combinations = [];
	//testing every combination to find the conbination's attributes' case of the user
	for (var combination = 0; combination < combinations.length; ++combination)
	{
		if(combinations[combination]['idCombination']==idComb)
		{
			var combAttr = combinations[combination]['idsAttributes'];
			ids = $.merge(ids, combAttr);
			return ids;
		}
	}
	for (var i=0; i<ids.length;++i)
	{
		ids[i]=parseInt(ids[i]);
	}
	return ids;
}

function showStepResult()
{
	if(typeof(_MP)=='undefined')
	return;
	
	removeShowErrors();
	disableMegaFields();
	checkActionQuantities();
	applyDefaultDate();
	
	
	if(_MP.ajax_price==1)
	{
		showprice( getIdProduct(), getIdCombination(), true, null, $('#quantity_wanted').val(), null);
	}
	else
	{
		_MP.changePrice();
	}
	if(typeof megaGroups!='undefined' && megaGroups.length>0 && $('#mp-step-result').length)
	{
		$('#mp-step-result').html('');
		var images = $('<div>');
		for (k=0; k<megaGroups.length; k++)
		{
			if(typeof megaGroups[k]!='undefined' && megaGroups[k]['type']!='2')
			{
				var id_group = megaGroups[k]['id_group'];
				var id_addgroup = megaGroups[k]['id_addgroup'];
				var mpgroup = megaGroups[k];
				
				if($('#megalabel_'+id_addgroup+' .mega_title').length && !$('#megagroup'+id_addgroup).hasClass('hideMegaField') && mpgroup['action']!=1)
				{
					images.append('<span class="mp-label-result">'+$('#megalabel_'+id_addgroup+' .mega_title').html()+'</span>');
					if(mpgroup['type']!='7' && mpgroup['type']!='3' && mpgroup['show']!='3')
					{
						images.append('<br/><span class="mp-data-result">'+$('#megalabel_'+id_addgroup+' .megaattr_name').html()+'</span><br/>');
					}
					else if(mpgroup['show']!='3')
					{
						images.append('<br/><span class="mp-data-result">'+$('#megafield_'+id_addgroup).val()+'</span><br/>');
					}
					if(mpgroup['show']=='3')
					{
						$('#megagroup'+id_addgroup+' .mega-qty-list').each(function(){
							var qty = $(this).val();
							if(qty!=0)
							{
								var attrId = $(this).attr('data-attr');
								var labelQty = '';
								if($('#productName_'+attrId).length)	
									 labelQty  = $('#productName_'+attrId).html(); 
								else if($('#qty-label-'+attrId).length)	
									 labelQty  = $('#qty-label-'+attrId).html();  
								images.append('<br/><span class="mp-data-result">'+qty+'x'+labelQty+'</span>');
								
							}
						});
						images.append('<br/>');
					}
				}
				
				}
		}
		var dates = '<div class="mp-result-dates">';
		if($('#id_date_start').length)
		{
			dates +='<span class="mp-result-start">'+$('#id_date_start').datepicker().val()+'</span>';
		}
		if($('#id_date_end').length)
		{
			dates +='<span class="mp-result-end"> / '+$('#id_date_end').datepicker().val()+'</span>';
		}
		if($('#id_days').length && $('label[for="id_days"]').length)
		{
			dates +='<br/><span class="mp-result-days">'+$('label[for="id_days"]').html()+' '+$('#id_days').val()+'</span>';
		}
		if(checkTimeSlot())
		{
			dates +='<br/><span class="mp-result-time">'+$('#id_time_slots option:selected').text()+'</span>';
		}
		/*if(_MP.multiAvailability.length)
		{
			for(var k;k<_MP.multiAvailability.length;k++)
			{
				var event = _MP.multiAvailability[k];
				dates +='<br/><span class="mp-result-time">'+event.start._i+'</span>';
			}
			
		}*/
		if($('#quantity_wanted_p').length)
		{
			dates +='<br/><span class="mp-result-quantity">';
			if($('#quantity_wanted_p label').length)
				dates +=$('#quantity_wanted_p label').html()+' ';
			else if($("#label_id_step_quantity").length)
				dates +=$('#label_id_step_quantity').html()+' ';
		
			dates += $('#quantity_wanted').val()+'</span>';
		}
		dates += '</div>';
		images.append(dates);
		
		$('#mp-step-result').append(images);
	}
	refreshCalendar();
	//if(typeof rulesArray!='undefined' && rulesArray.length>0)
	showMultiPersonalization();
	
	// Change Urls Status
	changeFilterMPUrlStatus();
	

}
function hideStepMegaGroups()
{
	if(typeof megaGroups!='undefined' && megaGroups.length>0)
	{
		$('#megaproduct').hide();
		$('#quantity_wanted_p').addClass('mpHide');
		if($('#btnRanges').length>0)
		{
			$('#id_step_prices').show();
			$('#id_step_prices').click(function(){
				$('#btnRanges').click();
			});
			
		}
	}
	showMultiPersonalization();	
	
}
function showMegaproductTab(id)
{
	$('.showTab').hide();
	$('.showTab'+id).show();
	$('.mp-tab').removeClass('selected');
	$('#mp-tab'+id).addClass('selected');
	
}
function disableMegaFields()
{
	if(typeof megaGroups=='undefined')
		return
	$('.hideMegaField').removeClass('hideMegaField');	
	if(rulesArray.length>0)
	{
		for (var i=0; i<rulesArray.length; i++)
		{
			var applyRule = true;
			var selected_fields = rulesArray[i]['selected_fields'].split("|");
			var disabled_fields = rulesArray[i]['disabled_fields'].split("|");
			var date_start = rulesArray[i]['date_start'];
			var date_end = rulesArray[i]['date_end'];
			var days = rulesArray[i]['days'];
			var type = rulesArray[i]['rule'];
			var time = rulesArray[i]['time'];
			var timelogic = rulesArray[i]['timelogic'];
			var logical = rulesArray[i]['logical'];
			
			if(date_start!='' && typeof _MP.date_start!='undefined')
			{
				var yyyy = _MP.date_start.getFullYear().toString();                                    
			    var mm = (_MP.date_start.getMonth()+1).toString(); // getMonth() is zero-based         
			    var dd  = _MP.date_start.getDate().toString(); 
			 		                            
			    var dateselect = yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
				if(dateselect<date_start || dateselect>date_end)
				{		
					applyRule = false;
				}
				else
				{
					if(days!='')
					{
					  var arraydays = days.split("-"); 
					  var day = _MP.date_start.getDay().toString();
					  if(arraydays.indexOf(day)<0)
						  applyRule = false;
					}
				}			
			}
			if(time!='') 
			{
				if($('#id_time_slots').length==0)
					applyRule = false;
				else if($("#id_time_slots").is(":hidden") && $("#id_time_slots").val()!='')
				{
					var timsel = $("#id_time_slots").val();
					if(typeof timsel=='string')
					{
						var arrayTime = timsel.split('-');
						if(arrayTime.length==3)
						{
							var n  = arrayTime[1];
							if(timelogic==0 && n<time)
								applyRule = false;
							else if(timelogic==1 && n>=time)
								applyRule = false;
						}
					}
					
				}
				else if($('#id_time_slots option:selected').attr('date-start'))
				{
					var n  = $('#id_time_slots option:selected').attr('date-start');
					if(timelogic==0 && n>=time)
						applyRule = false;
					else if(timelogic==1 && n<time)
						applyRule = false;
				}
			}
			var existAttr = false;
			if(applyRule && rulesArray[i]['selected_fields']!='')
			for(var j=0; j<selected_fields.length; j++)
			{	
				arraySelect = selected_fields[j].split('-');
		
				if(type==0)
					var selectedRule = false;
				else
					var selectedRule = true;
				if(arraySelect.length==2)
				{
					for (var k=0; k<megaGroups.length; k++)
					{
						if(megaGroups[k]['multiselect']==1)
						{
							var selectAttr = getMultiSelectGroup(megaGroups[k]['id_addgroup']);
							if($.inArray(arraySelect[1],selectAttr)>=0)
							{ 
								existAttr = true
								if(type==0)
									selectedRule = true;
								else
									selectedRule = false;
							}
						}
						else if((megaGroups[k]['type']==1 && arraySelect[0]=='p') || (megaGroups[k]['type']==0 && arraySelect[0]=='a'))
						{
							if(typeof megaGroups[k]['selected']!='undefined' && megaGroups[k]['selected']==arraySelect[1])
							{
								existAttr = true
								if(type==0)
									selectedRule = true;
								else
									selectedRule = false;
							}
						}		
					}
					if(arraySelect[0]=='t')
					{
						var id_time_slot = $('#id_time_slots').val();
						if(checkTimeSlot() && id_time_slot==arraySelect[1])
						{
							selectedRule = true;
						}
					}
				}
				if(logical=='and' && !selectedRule)
					applyRule = false;
			}
			if(!existAttr && type!=2)
				applyRule = false;
			if(applyRule)
			{
				for(var j=0; j<disabled_fields.length; j++)
				{
					$arrayDisabled = disabled_fields[j].split('-');
					if($arrayDisabled.length==2)
					{
						if($arrayDisabled[0]=='g')
						{
							$("#megagroup"+$arrayDisabled[1]).addClass('hideMegaField');
							checkDisableQtyList($arrayDisabled[1]);
						}
						else
						{
							for (var k=0; k<megaGroups.length; k++)
							{
								if((megaGroups[k]['type']==1 && $arrayDisabled[0]=='p') || (megaGroups[k]['type']==0 && $arrayDisabled[0]=='a'))
								{
									hideRuleField($arrayDisabled[0],$arrayDisabled[1],megaGroups[k]['id_addgroup']);
								}
							}
						}
					}
				}
			}	
		}
	}
}
function checkDisableQtyList(id_addgroup)
{
	for (var m=0; m<megaGroups.length; m++)
	{
		if(megaGroups[m]['id_addgroup']==id_addgroup)
		{
			if(megaGroups[m]['type']==0 && megaGroups[m]['show']==3)
			{
					$('#megagroup'+id_addgroup+' .mega-qty-list').each(function(){
						$(this).val(0);
						
					});
					$('#quantity_wanted').val(1);
			}
		}
	}
}
function selectRuleOptions(megagroup,idattr)
{
	if(typeof megagroup=='undefined' || megagroup==null)
		return;
	id_group = megagroup['id_group'];
	id_addgroup = megagroup['id_addgroup'];
	var megafield =  getMegaField(megagroup,id_addgroup,idattr);
	
	megagroup['selected'] = idattr;
	changeOptionSelected(megafield);
	if(idattr!=0 && megagroup['show']!='3')
	{
		if(megagroup['show']=='4')
		{
			$(megafield).prop("checked", true);
		}
		if(megagroup['show']=='0')
		{
			$(megafield).parent('select').val(idattr);
		}
		var arrayAttr = new Array();
		arrayAttr.push(idattr);
		changeTitleSelected(megagroup,id_addgroup,arrayAttr);

		changeImageSelected(megagroup,id_addgroup,idattr);
		
		if(megagroup['dep']=='0')
		{
			setAttrSelectedId(id_group,idattr);
			if(typeof productHasAttributes!='undefined' && productHasAttributes)
			{
				if($('#group_'+id_group).length>0)
				{
					$('#group_'+id_group).change();
				}
				else if($('#color_'+idattr).length>0)
				{
					$('#color_'+idattr).click();
					setAttrSelectedId(id_group,idattr);
				}
			}
		}
	
		megagroup['selected'] = idattr;
	
	}
}
function ruleMeasure(rule,measure,option)
{
	if((rule>measure && option==0) || (rule<measure && option==1) || (rule==measure && option==2))
		return true;
	else
		return false;
}
function checkDisableSelected(id_group,id)
{
	var hasSelect = false;
	for (n=0; n<megaGroups.length; n++)
	{
		if(megaGroups[n]['id_addgroup']==id_group)
		{
			if(megaGroups[n]['selected']==id || in_array(id, megaGroups[n]['selections']))
			{
				if(megaGroups[n]['selected']==id)
				{
					megaGroups[n]['selected']='';
					hasSelect = true;
				}
				else if (in_array(id, megaGroups[n]['selections']))
				{
					var index =  megaGroups[n]['selections'].indexOf(id);
					if (index > -1)
					{
						megaGroups[n]['selections'].splice(index, 1);
						hasSelect = true;
					}
				}
				removeMegaSelect(megaGroups[n],id);
			}
		}
	}
	return hasSelect;
}
function hideRuleField(type,id, id_group)
{
	if(type=='a' || type=='p')
	{
		var hasSelected = checkDisableSelected(id_group,id);
		var changeSelected = false;
		if($('#megafield_'+id_group+'_'+id).length>0)
		{
			if($('#megafield_'+id_group+'_'+id).parent('li').length>0)
			{
				$('#megafield_'+id_group+'_'+id).parent('li').addClass('hideMegaField');
				if(hasSelected)
				{
					$('#megafield_'+id_group+'_'+id).parent('li').parent().find('li').each(function(){
						if(!changeSelected && !$(this).hasClass('hideMegaField'))
						{
							changeSelected = true;
							id = $(this).attr('alt');
							if($('#megafield_'+id_group+'_'+id).is(':radio')){
								$('#megafield_'+id_group+'_'+id).prop('checked',true);
								updateMegaAttrSelect(id_group,id);
							}
							else if($('#megafield_'+id_group+'_'+id).length)
								$('#megafield_'+id_group+'_'+id).click();
						}	
					});
				}
			}
			else
			{
				$('#megafield_'+id_group+'_'+id).addClass('hideMegaField');
				if(hasSelected)
				{
					/*$('#megafield_'+id_group+'_'+id).parent().find('li').each(function(){
						if(!changeSelected && !$(this).hasClass('hideMegaField'))
						{
							changeSelected = true;
							id = $(this).attr('alt');
							$('#megafield_'+id_group+'_'+id).click();
						}	
					});*/
				}
			}
				
		}
		else if($('#megafield_'+id_group+' option[value="'+id+'"]').length>0)
		{
			$('#megafield_'+id_group+' option[value="'+id+'"]').addClass('hideMegaField');
			if(hasSelected)
			{
				$('#megafield_'+id_group+' option').each(function(){
					if(!changeSelected && !$(this).hasClass('hideMegaField'))
					{
						changeSelected = true;
						$('#megafield_'+id_group).val($(this).val());
						$('#megafield_'+id_group).change();
						
					}	
				});
			}
		}
	}
	else if(type=='g')
	{
		$("#megagroup"+id_group).addClass('hideMegaField');
	}
}
function hideMegaAttributeGroups()
{
	if(typeof megaGroups!='undefined' && megaGroups.length>0)
	{
		for (i=0; i<megaGroups.length; i++)
		{
			if(typeof megaGroups[i]!='undefined')
			{
				var id_megagroup = megaGroups[i]['id_group'];
				var id_group = megaGroups[i]['id_addgroup'];
				var megagroup = megaGroups[i];
				if(megagroup['hide']==1)
				{
					if(megagroup['dep']=='0' && megagroup['type']=='0')
					{
						if($('#group_'+id_megagroup).length>0)
						{
							$('#group_'+id_megagroup).parents('.attribute_fieldset').hide();
						}
						else if($('label[for="group_'+id_megagroup+'"]').length)
						{
							$('label[for="group_'+id_megagroup+'"]').parents('.attribute_fieldset').hide();
						}
						else if($('.color_pick_hidden[name="group_'+id_megagroup+'"]').length)
						{
							$('.color_pick_hidden[name="group_'+id_megagroup+'"]').parents('.attribute_fieldset').hide();
						}
						else if($('#color_to_pick_list').length>0)
						{
							$('#color_to_pick_list').parents('.attribute_fieldset').hide();
						}
					}
					else if(megagroup['dep']=='1')
					{
						$('#mpgroup_'+id_megagroup).parent().hide();
					}
				}
				var idattr = 0;
				if(megagroup['default_id']!='')
				{
					idattr = parseInt(megagroup['default_id']);
				}
				else if(megagroup['dep']=='0'  && megagroup['type']=='0')
				{
					idattr = getAttrSelectedId(id_megagroup);
				}
				else
				{
					idattr = getFisrtAttrSelectedId(id_group);
				}
					
				var megafield =  getMegaField(megagroup,id_group,idattr);
					
				megagroup['selected'] = idattr;
				changeOptionSelected(megafield);
				if(idattr!=0 && megagroup['show']!='3')
				{
					var arrayAttr = new Array();
					arrayAttr.push(idattr);
					if(megagroup['show']=='4')
					{
						$(megafield).prop("checked", true);
					}
					else if(megagroup['multiselect']=='1' && megagroup['show']=='1')
					{
						if(megagroup['multiselectmin']>1){
						arrayAttr = new Array();
							$('#megagroup'+id_group+' .mpcheckbox').slice(0,megagroup['multiselectmin']).each(function(){
								$(this).prop("checked", true);
								arrayAttr.push($(this).val());
							
							});
							changeTitleSelected(megagroup,id_group,arrayAttr);
						
						} else {
						$(megafield).prop("checked", true);
						}
						
					}
					else if(megagroup['show']=='0')
					{
						$(megafield).parent('select').val(idattr);
					}
					
					
					changeTitleSelected(megagroup,id_group,arrayAttr);
			
					changeImageSelected(megagroup,id_group,idattr);
				}
			}
		}
		
	
	}
	
	if(typeof mpAddProduct!='undefined' && mpAddProduct==0)
	{
		$('#mp-step-quantity').hide();
	}
	
	if(typeof _MP!="undefined" && _MP.ajax_price==1)
	{
		if($('#id_date_start').length && $('#id_date_start').val()!='')
			_MP.date_start = $('#id_date_start').datepicker("getDate");		
	}
	showStepResult();
};
function getMultiSelectGroup(id_group)
{
	var mpgroup = getMPGroupById(id_group);
	var selections = new Array();
	if(mpgroup['show']=='0')
	{
		selections = $('#megafield_'+id_group).val();
	}
	else if(mpgroup['show']=='1' || mpgroup['show']=='4')
	{
		
		$('#megagroup'+id_group+ ' .mpcheckbox:checked').each(function(item){
			selections.push($(this).val());
		});
	}
	else
	{
		if(typeof mpgroup['selection']!='undefined')
		selections.push(mpgroup['selection']);
	}
	if(selections==null)
		selections = new Array();
		
	return selections;
	
}
function listDirectOrder()
{
	var sendgroups = '&directorder=1';
	var resultgroups= new Array();
	resultgroups[0]=0;
	resultgroups[1]='';
	resultgroups[2]= new Array();
	
	if($('.mp-directorder-form').length)
	{
		
		var email = '';
		$('.mp-directorder-form input').each(function(){
			if($(this).val()=='')
			{
					resultgroups[0]=1;
					resultgroups[1]= errorInfoDirectOrder;
					
			}
			else if(resultgroups[0]==0)
			{
				var idfield = $(this).attr('id');
				var valueField = $(this).val();
				valueField = valueField.trim();
				if(idfield=='mpdo-email')
				{
					email = valueField;		
				}
				sendgroups+= '&'+idfield+'='+valueField;
			}
		});
		if(email!='')
		{
			var existemail = false;
			url = baseDir + 'index.php?fc=module&module=megaproduct&controller=ajaxservices&type=checkemail&email='+email;
			$.ajax({
				type : "GET",
				async : false,
				url : url,
				success : function(data) {
					if(data)
					{
						existemail= true;
					}
				}
				
			});
			
			if(existemail)
			{
				resultgroups[0]=1;
				resultgroups[1]= errorInfoExitEmail;
			}	
		}
	}
	if(resultgroups[0]==0)
		resultgroups[1]= sendgroups;
	return resultgroups;
}
function getQuantityMegaSeats()
{
	var qty = 0;
	if($('#addTicketZones').length)
	{
		$('#addTicketZones tr').each(function(){
			qty += parseInt($(this).data('qty'));
		});	
	}
	return qty;
}

function getMegaSeats()
{
	var seats = '';
	if($('#addTicketZones').length)
	{
		var arraySeats = new Array();
		$('#addTicketZones tr').each(function(){
			arraySeats.push($(this).data());
		});
		seats = '&seats='+JSON.stringify(arraySeats); 
	}
	return seats;
}
function showCustomSeats(){
	$('#mp-zone-map-cont,#mp-cart-info').show();
	$('#customContentMPForm').hide();
}
function showMPCustomData(){
	if(typeof applyMPCustomPersonalization!='undefined')
		applyMPCustomPersonalization();
	$('#customContentMPForm').fadeIn('1500');
	if($('#mp-zone-map-cont').length){
		$('#mp-zone-map-cont,#mp-cart-info').hide();
		$('#mpshowseats').show();
	}
		
	if(_MP.modal_info==1 && $('#calculePriceData').length && $("#calculePriceData").hasClass("ui-dialog-content")){
		
		$(".ui-dialog-content").dialog("close");
		goToByScroll('customMPData');
	}
	
}
function addMegaProduct (idProduct, idCombination, addedFromProductPage, callerElement, quantity, whishlist, directOrder)
{
	if($('#mp-cgv').length && !$("#mp-cgv").is(':checked'))
	{
		showErrorAlert(errorInfoAcceptterms);
		return;
	}
	var checkdates = true;
	if($('#id_date_start').length && $('#id_date_start').parents('.mpstep').length && $('#id_date_start').parents('.mpstep').hasClass('hideMegaField'))
		checkdates = false;

	if(checkdates)
	{
		if(checkTimeSlot() && ($('#id_time_slots').val()==0 || $('#id_time_slots').val() ==null)){
			showErrorAlert(errorInfoSelectTime);
			return;
		}
		if(($('#id_date_start').length>0 && $('#id_date_start').val()=='') || 
				($('#id_date_end').length>0 && $('#id_date_end').val()==''))
		{	
			showErrorAlert(errorInfo0);
			return;
		}
		// Send all event data correctly
		if(_MP.multiAvailability.length)
		{
			var event = _MP.multiAvailability[_MP.sendEvent];
			if($('#id_date_start')){
				$('#id_date_start').datepicker("setDate", new Date(event.start._i));
			}
			if(typeof(_MP)!="undefined")
			{
				 _MP.date_start = new Date(event.start._i);
			}
			if(checkTimeSlot())
				$('#id_time_slots').val(event.id_timeslot);
			
			_MP.sendEvent++;
			
		}
	}
	
	
	if(_MP.modal_info==1)
		closeMPInfo('#calculePriceData');
	
	
	if(typeof mpOnlaunch!='undefined')
		mpOnlaunch = 1;
	
	
	
	//disabled the button when adding to not double add if user double click
	if (addedFromProductPage)
	{
		$('#add_to_cart button').prop('disabled', 'disabled').addClass('disabled');
		$('.filled').removeClass('filled');

	}
	else
		$(callerElement).prop('disabled', 'disabled');

	if ($('.cart_block_list').hasClass('collapsed'))
		this.expand();
	
	
	var sendgroups = getSendGroups(quantity);
	if(sendgroups===false)
		return false;
	
	
	if(directOrder)
	{
		var resultDirectOrder = listDirectOrder();
		if(resultDirectOrder[0]==1)
		{
			showErrorAlert(resultDirectOrder[1]);
			return;
		}
		else
		{	
			sendgroups +=resultDirectOrder[1];
		}
	}
	
	//sendgroups += listCombinationIds();
	
	
	dataoptions = getDataServices();
	
	sendgroups += getMegaSeats();
	
	if($('#customContentMPForm').length){
		var qtycheck = quantity;
		
		if($('#addTicketZones').length)
		{
			qtycheck = getQuantityMegaSeats();
			
		}
		if(_MP.arrayCustom.length!=qtycheck){
			showMPCustomData();			
			return;
		}
		else if(_MP.arrayCustom.length>0)
		{
			if(_MP.multiAvailability.length){
				var arraySend = new Array();
				arraySend.push(_MP.arrayCustom[_MP.sendEvent]);
				sendgroups += '&mpcustom='+JSON.stringify(arraySend);
			}		
			else{
				sendgroups += '&mpcustom='+JSON.stringify(_MP.arrayCustom);
			}	
				
		}
	}
	
	
	if($('#btnAddCalculeService').length)
		$('#btnAddCalculeService').attr('disabled','disabled').addClass('disabled');
	
	if(_MP.multiAvailability.length && _MP.sendEvent==1)
		sendgroups += '&multiEvents='+_MP.multiAvailability.length;
	$.ajax({
		type: 'POST',
		url: baseDir + 'index.php?fc=module&module=megaproduct&controller=ajaxservices&type=checkdate',
		async: false,
		cache: false,
		dataType : "html",
		data: '&1'+dataoptions+sendgroups+'&qty=' + ((quantity && quantity != null) ? quantity : '1') + '&id_product=' + idProduct + '&token=' + static_token + ( (parseInt(idCombination) && idCombination != null) ? '&ipa=' + parseInt(idCombination): ''),
		success: function(jsonData,textStatus,jqXHR)
		{
			$('#calculePrice').remove();
			if(jsonData.indexOf("megaerror")>0){
				if($('#btnAddCalculeService').length)
					$('#btnAddCalculeService').removeProp('disabled').removeClass('disabled').attr('disabled', false);		

				$('#main').append(jsonData);
				$('#calculePrice').hide();
		
				showMPInfo('#calculePriceData','','');
				if($('#btnAddCalculeService').length)
                    $('#btnAddCalculeService').removeProp('disabled').removeClass('disabled').attr('disabled', false);
				
				_MP.sendEvent = 0;
				
			}
			else if(jsonData && jsonData!='\n' && jsonData!='\r\n')
			{
				$('#main').append(jsonData);
				$('#calculePrice').hide();
				
				showMPInfo('#calculePriceData','','');
			
				if($('#btnAddCalculeService').length)
					$('#btnAddCalculeService').removeProp('disabled').removeClass('disabled');
				
				_MP.sendEvent = 0;
				return;
			}
			else
			{
				
				//send the ajax request to the server
				$.ajax({
					type: 'POST',
					headers: { "cache-control": "no-cache" },
					url: baseDir + '?rand=' + new Date().getTime(),
					async: true,
					cache: false,
					dataType : "json",
					data: 'action=update&controller=cart&add=1&ajax=true'+sendgroups+dataoptions+'&qty=' + ((quantity && quantity != null) ? quantity : '1') + '&id_product=' + idProduct + '&token=' + static_token + ( (parseInt(idCombination) && idCombination != null) ? '&ipa=' + parseInt(idCombination): ''),
					success: function(jsonData,textStatus,jqXHR)
					{
						if(typeof jsonData.success)
						{
							if(directOrder && typeof jsonData.directOrder!='undefined' && jsonData.url!='undefined')
								setTimeout(function(){document.location.href = jsonData.url},10);
								
							if(typeof jsonData.errors && jsonData.errors!=''){
								showErrorAlert(jsonData.errors);
							return;	
							}
							
							if(_MP.multiAvailability.length && _MP.multiAvailability.length>_MP.sendEvent)
							{
								$('#btnAddCalculeService').removeProp('disabled').removeClass('disabled');
								$('#btnAddCalculeService').click();
								$('#btnAddCalculeService').attr('disabled','disabled').addClass('disabled');
								return;
							}
							if(_MP.multiAvailability.length && _MP.multiAvailability.length==_MP.sendEvent)
							{
								setTimeout(function(){document.location.href = "index.php?controller=cart&action=show"},500);
								return;
							}
							if($('#mp-place-seats').length)
								closeMPInfo('#mp-place-seats');
			
							/*prestashop.emit('updateCart',  {
						        reason: {
							          idProduct: jsonData.id_product,
							          idProductAttribute: jsonData.id_product_attribute,
							        	idMegacart: jsonData.id_megacart,
							          linkAction: 'add-to-cart'
							        }});*/
							        prestashop.emit('updateCart', {
	            reason: {
	              idProduct: jsonData.id_product,
	              idProductAttribute: jsonData.id_product_attribute,
	              linkAction: 'add-to-cart',
	              cart: jsonData.cart
	            },
	            resp: jsonData
	          });  
								loadTimeSlots();	
							}
						//setTimeout(function(){document.location.href = cartURL+"?action=show"},500);
					
						
							
						
						
						
						if (typeof contentOnly!='undefined' && contentOnly)
							parent.$.fancybox.close();
						goToByScroll('shopping_cart');
						
						$('#btnAddCalculeService').removeProp('disabled').removeClass('disabled');
						
					},
					error: function(XMLHttpRequest, textStatus, errorThrown)
					{
						
						setTimeout(function(){document.location.href = cartURL+"?action=show"},500);
						return;
						
						
					}
					
				});
				
				
			}
			
		}
	});
	
	
};
function restarFechas(first, second) {

    // Copy date parts of the timestamps, discarding the time parts.
    var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
    var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

    // Do the math.
    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var millisBetween = two.getTime() - one.getTime();
    var days = millisBetween / millisecondsPerDay;
    days = Math.round(days);
    // Round down.
    return Math.floor(days);
}

// Type 0 => Return Url, 1 => Return Diff days
function getDataServices(type)
{
	if(typeof type =='undefined')
		type = 0;
	var normaly = ''; 
	if($('#id_date_start').length && $('#id_date_start').parents('.mpstep').length && $('#id_date_start').parents('.mpstep').hasClass('hideMegaField'))
		normaly ='&mptype=N';
	
	var days = 1;
	if(typeof _MP.days!='undefined' && _MP.days>1)
		days = _MP.days;
	if($('#id_drop_date').length){
		if ($('#id_drop_date').is(':radio'))
			var date_start = new Date($('#id_drop_date:checked').val());
		else
			var date_start = new Date($('#id_drop_date').val());
	}
	else if($('#id_date_start').length)
		var date_start = $('#id_date_start').datepicker('getDate');
	else
		var date_start = _MP.date_start;
	if(date_start==null)
		date_start = _MP.date_start;
	if(date_start==null)
		date_start = new Date();
	if(typeof(_MP)!="undefined" && _MP.service_select==100)
	{
		date_start = new Date(date_start.getFullYear(), date_start.getMonth(), date_start.getDate() - date_start.getDay()-1);
		if($('#id_date_end').length>0)
		{
			// var dateend = $('#id_date_end').datepicker('getDate');
			if(typeof _MP.date_end=="undefined"){
				  _MP.date_end= $('#id_date_end').datepicker('getDate');
			 }
			 var dateend = _MP.date_end;
			 date_end = new Date(dateend.getFullYear(), dateend.getMonth(), dateend.getDate() - dateend.getDay() + 8);
				
			 if(date_end!=null)
			 {
			 	days = restarFechas(date_start,date_end);
				 //days = Math.round((date_end - date_start) / (1000 * 60 * 60 * 24));
			}

		}
		else
		{
			days = 1;
			if($('#id_days').length)
				days = days * parseInt($('#id_days').val());
		}
	}
	else
	{
		//date_start = $('#id_date_start').datepicker('getDate');
		if($('#id_days').length>0)
		{
			days=$('#id_days').val();
		}
		else if($('#id_date_end').length>0)
		{
			
			// var date_end = $('#id_date_end').datepicker('getDate');
			var date_end = _MP.date_end;
			 if(date_end!=null)
			 {
			 	days = restarFechas(date_start,date_end);
			 	if(_MP.end_date==0)
			 		days++;
			 	
			 	if(days<0)
			 	 days = 0;
				 //days = Math.round((date_end - date_start) / (1000 * 60 * 60 * 24));
			}

		}
		
	}
	
	var day = date_start.getDate();
	var month = date_start.getMonth()+1; 
	var year = date_start.getFullYear(); 
	
	
	if(days==0)
		days=1;
	
	if(type==1)
		return days;
	var timeslots = '';
	if(checkTimeSlot())
	{
		var times = $('#id_time_slots').val();
		if(times!='' && times!=null)
		{
			var arrayTime = times.split('-');
			if(arrayTime.length>0)
				timeslots = '&id_timeslot='+arrayTime[0];
			if(arrayTime.length>1)
				timeslots += '&timestart='+arrayTime[1]; 
			if(_MP.time==5)
			{
				var timeend = $('#id_time_end').val();
				var arrayTime2 = timeend.split('-');
				timeslots += '&timeend='+arrayTime2[1];
				timeslots += '&id_timeslotend='+arrayTime2[0];
			}
			else if(arrayTime.length>2)
				timeslots += '&timeend='+arrayTime[2];
			else{
				timeslots += '&timeend='+arrayTime[1];
			}
		}
	}
	return '&day='+day+'&month='+month+'&year='+year+timeslots+'&days='+days+normaly;
};
function checkMegaTimes(showalert)
{	
	var startime = '';
	if(_MP.time==2 || _MP.time==3 || _MP.time==6)
	{
		if($('#starttime').length)
		{
			startime = $('#starttime').val();
			if($('#starttime').val()=='' || $('#starttime').val() == null)
			{			
				$('#id_time_slots').val('');
				if(showalert)
					showErrorAlert(errorInfoSelectTime);
				return false;
			}
		}
		
	}
	if(_MP.time==3 || _MP.time==6)
	{
		if($('#endtime').length)
		{	
			if($('#endtime').val()=='' || $('#endtime').val()==null)
			{
				$('#id_time_slots').val('');
				if(showalert)
					showErrorAlert(errorInfoSelectTime);
				return false;
			}
			if(dateDiff($('#endtime').val(),startime)<0)
			{
				// Check distinct days
				if(_MP.time==6)
				{
					days = getDataServices(1);
					if(days>1)
						return true;
				}
				$('#id_time_slots').val('');
				if(showalert)
					showErrorAlert(errorInfoSecondTime);
				return false;
			}
		}
	}
	return true;
}
function dateDiff(time1,time2) 
{
	  var t1 = new Date();
	  var parts = time1.split(":");
	  if(typeof parts[2]=='undefined')
		  parts[2]='00';
	  t1.setHours(parts[0],parts[1],parts[2],0);
	  var t2 = new Date();
	  parts = time2.split(":");
	  if(typeof parts[2]=='undefined')
		  parts[2]='00';
	  t2.setHours(parts[0],parts[1],parts[2],0);

	  return parseInt((t1.getTime()-t2.getTime())/1000);
}
function getMegaTimes()
{
	var timesend = '';
	
	if(_MP.time==2 || _MP.time==3 || _MP.time==6)
	{
		if($('#starttime').length)
		{
			timesend += '&loadtimestart='+$('#starttime').val();
		}	
	}
	if(_MP.time==3 || _MP.time==6)
	{
		if($('#endtime').length)
		{
			timesend += '&loadtimeend='+$('#endtime').val();
		}
	}
	if($('#starttime').length && ($('#starttime').val()!='' && $('#starttime').val()!=0))
	{
		timesend += '&startselect='+$('#starttime').val();
	}
	return timesend;	
}
function removeLastTimeOptions()
{

}
function getIdProduct()
{
	if($('#product_page_product_id').length)
		return $('#product_page_product_id').val();
	if($('.mph-home-container').length)
		return $('.mph-home-container').data('product');
	if($('#id_product').length)
		return $('#id_product').val();
	return 0;
}
function loadTimeSlots()
{	
	var result = true;
	var selected = $('#id_time_slots').val();
	
	if(!checkMegaTimes(false))
		return;
	
	var timesend = getMegaTimes();
	

	
	var sendgroups = getSendGroups(1);
	if(sendgroups===false)
		return false;

	
	var datasevices = getDataServices(0);
	
	var async = true;
	if(_MP.time==2 || _MP.time==3 || _MP.time==6)
		async = false;
	if(typeof applysearch!='undefined' && !applysearch)
		async = false;
	
	currentTime = new Date();
	time = currentTime.getTime();
	timesend += '&timenow='+time;
	//hours = currentTime.getHours();
	
	$.ajax({
		type: 'POST',
		url: baseDir + 'index.php?fc=module&module=megaproduct&controller=ajaxservices'+timesend,
		async: async,
		cache: false,
		dataType : "json",
		data: 'type=loadtimeslots'+sendgroups+datasevices+ '&id_product=' + getIdProduct()+'&qty='+$('#quantity_wanted').val(),
		success: function(jsonData,textStatus,jqXHR)
		{
			if(jsonData.error!='')
			{
				if(jsonData.error=='nextday')
				{
					if($("#id_date_start").length)
					{
						var day =  $("#id_date_start").datepicker("getDate");
						day.setDate(day.getDate()+1);
						$('#id_date_start').datepicker("setDate", day);
						_MP.date_start =  day;
						loadTimeSlots();
					}
					
					
					return;
				}
				$('#id_time_slots').val('');
				showErrorAlert(jsonData.error);
				result = false;
			}
			if(_MP.time==0)
			{
				$('#id_time_slots').find('option').remove().end();
				if(jsonData.html!='')
				{
					$('#id_time_slots').html(jsonData.html);
					if($("#id_time_slots option[value='"+selected+"']").length)
						$('#id_time_slots').val(selected);
				}
			}
			if(_MP.time==4 || _MP.time==5)
			{
				var start = $('#id_time_start').val();
				var end = $('#id_time_end').val();
				
				$('#starttime').find('option').remove().end();
				$('#endtime').find('option').remove().end();
				if(jsonData.html!='')
				{
					var addoption = false;
					$('#starttime').html(jsonData.html);
					if(typeof start!='undefined' && start!='')
					{
						if($("#starttime option[value='"+start+"']").length)
							$('#starttime').val(start);
					}
					else
					{
						addoption=true;
					}
					
					$('#starttime option').each(function(){
						if(!addoption && $(this).val()>=start)
						{
							addoption = true;
						}
						if(addoption)
						{
							var dateend = $(this).attr('date-end');
							$('#endtime').append($('<option></option>').val(dateend).html(dateend));	
						}
					
					});
					if(_MP.time==5 && $('#endtime').length)
					{
						$('#endtime').html(jsonData.html2);
					}
					if(typeof end!='undefined' && end!='')
					{
						if($("#endtime option[value='"+end+"']").length)
							$('#endtime').val(end);
					}
					var start = $('#starttime').val();
					var end = $('#endtime').val();
					$('#id_time_slots').val(start+'-'+end);
					$('#id_time_start').val(start);
					$('#id_time_end').val(end);
				}
				else
				{
					$('#id_time_slots').val('');
					$('#id_time_start').val('')
				}
				
			}
			if(_MP.time==1)
			{
				$('#id_time_slots').val('');
				$('#id_buttons_slot').html('');
				if(jsonData.html)
				{
					$('#id_buttons_slot').html(jsonData.html);
					if($("#id_buttons_slot li a[value='"+selected+"']").length)
					{
						$('#id_time_slots').val(selected);
						$("#id_buttons_slot li a[value='"+selected+"']").addClass('selectAttr');
					}
					else
					{
						selected = $("#id_buttons_slot li a:first").attr('value');
						$('#id_time_slots').val(selected);
						$("#id_buttons_slot li a[value='"+selected+"']").addClass('selectAttr');
					}
				}
				$('#id_buttons_slot a').click(function(){
					$('#id_buttons_slot a').removeClass('selectAttr');
					selected = $(this).attr('value');
					$('#id_time_slots').val(selected);
					$(this).addClass('selectAttr');
					showStepResult();
				});
			}
			if(_MP.time==2 || _MP.time==3 || _MP.time==6)
			{
				$('#id_time_slots').val(jsonData.html);
			}
			if(typeof jsonData.attrservices != 'undefined' && jsonData.attrservices)
			{
				var parentAttr = null;
				var selectAttr = 0;
				for (var k in jsonData.attrservices)
				{
					var id_attribute = k;
					var hasService = jsonData.attrservices[k];
					if(parentAttr==null){
						parentAttr = $('option[value="'+id_attribute+'"]').parent(':first');
						selectAttr = $(parentAttr).val();
					}
					if(hasService=='0'){
						if(selectAttr==id_attribute){
							selectAttr = 0;
							$('option[value="'+id_attribute+'"]').attr('selected','');
						}	
						$('option[value="'+id_attribute+'"]').hide();
					}
					else{
						if(selectAttr==0){
							selectAttr = id_attribute;
							$('option[value="'+id_attribute+'"]').attr('selected','selected');
						}
						$('option[value="'+id_attribute+'"]').show();	
					}
				}
				$(parentAttr).val(selectAttr);
			}
		}
	});
	return result;
};
function refreshCalendar()
{
	
	if($('#productcalendar').length)
	{
		var resultAttrs = listAttrIds();
		urldataservices = '&frontal=1&ipa='+getIdCombination();
		
		if(resultAttrs[0]!=1)
		{
			urldataservices =resultAttrs[1];
		}
		if(typeof loadFullCalendar!='undefined')
		{
	        //$('#productcalendar').fullCalendar('destroy');
	        loadFullCalendar();   
	      //  _MP.multiAvailability = new Array();
		}
	
	}
}
function getEventDate(event) { 
var dateobj = event._start;
date = dateobj.getFullYear()+'-'+dateobj.getMonth()+1+'-'+dateobj.getDate();
return date;
}
function addFullCalendarEvent(event)
{
	if(_MP.actionAvailability==0)
		return;
	
	if(event.color=='red')
		return;
	//console.log(event);
	if(_MP.actionAvailability==1)
		$('.mp-select').removeClass('mp-select');
			
	var name = '#'+event.id+'-'+event.id_timeslot.replace(':','').replace(':','');
	var removeEvent = false;
	if($(name).length)
	{
		if($(name).parent().hasClass('mp-select')){
			removeEvent = true;
			$(name).parent().removeClass('mp-select');
		}		
		else
			$(name).parent().addClass('mp-select');
	}
			
	
	if(_MP.actionAvailability==2)
	{
		if(removeEvent){
			for (var key in _MP.multiAvailability) {
				if(_MP.multiAvailability[key].id==event.id){
					_MP.multiAvailability.splice(key, 1);   
					break;
				}
					
			}	
		}
		else
			_MP.multiAvailability.push(event);
	}
	
	if($('#id_date_start')){
		$('#id_date_start').datepicker("setDate", new Date(event.start._i));
	}
	if(typeof(_MP)!="undefined")
	{
		 _MP.date_start = new Date(event.start._i);
	}
	if(checkTimeSlot())
		$('#id_time_slots').val(event.id_timeslot);
	
	if(_MP.actionAvailability==1)
	{
		if($('#btnCalculeService').length)
		{
			 $('#btnCalculeService').click();
		}
		else if($('#btnAddCalculeService').length)
		{
			goToByScroll('shopping_cart');
			 $('#btnAddCalculeService').click();
		}
	}
	
	showStepResult();
	
}
function checkTimeSlot()
{
	if(!$('#id_time_slots').length)
		return false;
	if($('#mp-time-slots').length && $('#mp-time-slots').hasClass('mpHide'))
		return false;
	return true;
}
function addMPDate(start,end,days,type){
	 var dayArray = new Array();
	 dayArray['start'] = start;
	 dayArray['end'] = end;
	 dayArray['type'] = type;
	 if(days!='')
		 dayArray['days'] = days.split('-');
	 else
		 dayArray['days'] = new Array();
	 for(var i=0; i<dayArray['days'].length; i++) { dayArray['days'][i] = parseInt(dayArray['days'][i]); } 
	 disableDays.push(dayArray); 
};
function addMPStartDate(start,end,days){
	 var dayArray = new Array();
	 dayArray['start'] = start;
	 dayArray['end'] = end;
	 if(days!='')
		 dayArray['days'] = days.split('-');
	 else
		 dayArray['days'] = new Array();
	
	 for(var i=0; i<dayArray['days'].length; i++) { dayArray['days'][i] = parseInt(dayArray['days'][i]); } 
	 startDays.push(dayArray); 
};
function get_next_month_with_event() {
	var date = new Date();
	var start = new Date();
	
	if(_MP.calendar_start!=0 && _MP.calendar_start!=''){
   		if(_MP.calendar_start.indexOf('D') !== -1){
   			date.setHours(0,0,0,0)
   			var adddays = parseInt(_MP.calendar_start);
   			date.setDate(date.getDate() + adddays);
   			
   			
   		} else {
   			startdays = parseInt((parseInt(_MP.calendar_start)+24)/24);
   			date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
   			date.setDate(date.getDate() + startdays );	
   		}
   		_MP.date_start = date;
   		
   		
   	}
	
	var finish = new Date();
	finish.setDate(finish.getDate()+1200);
	var available = false;
	if(disableDays.length)
	{
		while(!available && date<finish) {
			available = isAvailable(date)[0];
			
			if(!available)
			date.setDate(date.getDate()+1);
		}
	}
	if(bookedDays.length){
		 var dateAsString = date.getFullYear().toString() + "-" + ('0' + (date.getMonth()+1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2);
		 available = $.inArray( dateAsString, bookedDays ) ==-1 ? true : false;
		while(!available && date<finish) {
			available = isAvailable(date)[0];
			if(!available)
			date.setDate(date.getDate()+1);
		}  
			   
	}
	if(available)
	{
		 _MP.date_start = date;
		return date;
	}
	else
		return date;
};
function selectCurrentDays() {
	var days = $('#id_days').val();
	window.setTimeout(function () {
	var cell = $('#id_date_start').find('.ui-datepicker-current-day');
	var parent = $(cell).parent('tr');
	var newLine = false;
	for(var i=1;i<days;i++)
	{
		parent = $(cell).parent('tr');
		if(!newLine)
		{
			cell = $(cell).next('td');
			
		}
		newLine = false;
		if($(cell).length){
			if($(cell).find('a').length)
			$(cell).find('a').addClass('ui-state-active');
			else if($(cell).find('span').length)
				$(cell).find('span').addClass('ui-state-active');
		}
		/*else if($(cell).hasClass('ui-state-disabled'))
		{
			//cell = $(cell).next('td');
			i--;
		}*/
		else
		{
			i--;
			if($(parent).next('tr').length){
				newLine = true;
				cell = $(parent).next('tr').find('td:first');
			}
			else
				i = 100000;
		}
	}

	// $('#id_date_end').find('.ui-datepicker-current-day a').parents('tr:first').find('a').addClass('ui-state-active')
	}, 1);
}
function addMonthYear()
{
	if($('#id_month_select').length)
	{
		var d = new Date();
		var m = d.getMonth();
		var year = d.getFullYear();
		var nextYear = year+1;
	
		$('#id_month_select option').each(function(){
			var itemMonth = parseInt($(this).val());
			var option = $(this).text();
			if(itemMonth<=m)
				$(this).text(option+' '+nextYear);
			else
				$(this).text(option+' '+year);
		});
	}
}
function selectionMPDate()
{
	var type = $('#id_date_select').val();
	if(typeof _MP!='undefined')
		_MP.service_select = type;
	
	$('#mp-select-months').hide();
	$('#mp-select-week').hide();
	$('#mp-date-start').hide();
	$('#mp-date-end').hide();
	$('#mp-time-slots').hide().addClass('.mpHide');
	$('#id_time_slots').hide();
	$('#mp-days').hide();
	$('#productcalendar').hide();
	if(type==4 || type==3)
	{
		$('#mp-date-start').show();
		$('#mp-date-end').show();
		$('#mp-days').show();
		$('#productcalendar').show();
		selectMPDay();
	}
	if(type==2)
	{
		$('#mp-select-months').show();
		selectMPMonth();
	}
	if(type==3)
	{
		$('#mp-time-slots').show().removeClass('.mpHide');
		$('#id_time_slots').show();
		loadTimeSlots();
	}
	if(type==1)
	{
		$('#mp-select-week').show();
		selectMPWeek();
	}
}
function selectMPDay(){
	_MP.days = 1;
	if($('#id_days').length)
		$('#id_days').val(1);
}
function selectMPMonth(){
	var month = parseInt($('#id_month_select').val());
	var d = new Date();
	var n = d.getFullYear();
	var m = d.getMonth();
	var days = daysInThisMonth(month);
	if(month<=m)
		n++;
	var date = parseMPDate(n+'-'+month+'-01','yyyy-mm-dd');
	// Add date start
	if($('#id_date_start').length)
		$('#id_date_start').datepicker("setDate", new Date(date));
	_MP.date_start = date;
	// Add date end
	if($('#id_date_end').length){
		date.setDate(date.getDate()+days); 
		_MP.date_end = date;
		$('#id_date_end').datepicker("setDate", new Date(date));
	}
	// Add days	
	_MP.days = days;
	if($('#id_days').length)
		$('#id_days').val(days);
}
function selectMPWeek(){
	var date_start = $('#id_week_select option:selected').data('start');
	_MP.date_start = parseMPDate(date_start,'yyyy-mm-dd');
	// Add date start
	if($('#id_date_start').length)
		$('#id_date_start').datepicker("setDate", new Date(_MP.date_start));
	
	// Add date end
	if($('#id_date_end').length){
		 
		_MP.date_end = parseMPDate($('#id_week_select option:selected').data('end'),'yyyy-mm-dd');
		$('#id_date_end').datepicker("setDate", new Date(_MP.date_end));
	}
	days = 7;
	// Add days	
	_MP.days = days;
	if($('#id_days').length)
		$('#id_days').val(days);
}
function daysInThisMonth(month) {
	var d = new Date();
	var n = d.getFullYear();
	var date = parseMPDate(n+'-'+month+'-01','yyyy-mm-dd');
	
	  return new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
}
function loadMPWeeks()
{
	var d = new Date();
	var month = d.getMonth();
	var year = d.getFullYear();
	var weeks = getBeforeWeeks(6);
	if($('#id_week_select').length)
	{
		for(var i=0;i<weeks.length;i++)
		{
			$('#id_week_select').append('<option data-start="'+formatDate(weeks[i]['startDate'])+'" data-end="'+formatDate(weeks[i]['endDate'])+'" value="">'+formatDate(weeks[i]['startDate'])+' / '+formatDate(weeks[i]['endDate'])+'</option>')
		}
	}
}
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
function getBeforeWeeks(months){
	var start = new Date();
	var end = new Date();
	end.setMonth(end.getMonth()+months);
	var sDate;
	var eDate;
	var dateArr = [];

	while(start <= end){
	  if (start.getDay() == 1 || (dateArr.length == 0 && !sDate)){
	    sDate = new Date(start.getTime());
	  }

	  if ((sDate && start.getDay() == 0) || start.getTime() == end.getTime()){
		  var endDate = new Date(start);	
		  if(_MP.end_date==1)
			  endDate.setDate(endDate.getDate() + 1);
	        eDate = new Date(endDate.getTime());
	  }

	  if(sDate && eDate){
	    dateArr.push({'startDate': sDate, 'endDate': eDate});
	    sDate = undefined;
	    eDate = undefined;
	  }

	    start.setDate(start.getDate() + 1);
	}
	return dateArr;
} 
/*    URL CHANGE VALUES */
function resetGroupsByUrl(urlcode)
{
	if(urlcode=='')
		urlcode = getParameterByName('mpurl');
	if(urlcode!='')
	{
		var arrayGroups = urlcode.split('/');
		if(arrayGroups.length>1)
		{
			for(var i=1;i<arrayGroups.length;i++)
			{
				id_addgroup = 0;
				var group = arrayGroups[i].split('-');
				if(group.length>0)
				{
					id_addgroup = parseInt(group[0]);			
				}
				if(group.length>2)
				{
					for(var j=2;j<group.length;j=j+2)
					{
						id = parseInt(group[j]);
						if(typeof id!='undefined' && !isNaN(id))
						{
							var megagroup = getMPGroupById(id_addgroup);
							selectRuleOptions(megagroup,id);
						}
					}
				}
			}
		}
		findCombination();
	}
	resetUrlMeasures();
}

function resetUrlMeasures()
{
	var mpquantity = getParameterByName('mpquantity');
	if(typeof mpquantity!='undefined' && mpquantity!='')
	{
		addMPQuantity(mpquantity);
		/*if($('#id_step_quantity').length)
			$('#id_step_quantity').val(mpquantity);
		$('#quantity_wanted').val(mpquantity);*/
	}
}
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function updateQueryStringParam(key, value)
{
	  baseUrl = [location.protocol, '//', location.host, location.pathname].join('');
	  urlQueryString = document.location.search;
	  var newParam = key + '=' + value,
	  params = '?' + newParam;

	  // If the "search" string exists, then build params from it
	  if (urlQueryString) {
	    keyRegex = new RegExp('([\?&])' + key + '[^&]*');
	    // If param exists already, update it
	    if (urlQueryString.match(keyRegex) !== null) {
	      params = urlQueryString.replace(keyRegex, "$1" + newParam);
	    } else { // Otherwise, add it to end of query string
	      params = urlQueryString + '&' + newParam;
	    }
	  }
	  window.history.replaceState({}, "", baseUrl + params);
}
function addMPQuantity(qty)
{
	if($('#id_step_quantity').length)
		$('#id_step_quantity').val(qty);
	if($('#id_step_quantity_range').length)
		$('#id_step_quantity_range').html(qty);
	$('#quantity_wanted').val(qty);
	
}
function addInputValidation(result)
{
	if(typeof _MP!='undefined' && _MP.validation==1 && typeof result[3]!='undefined' && result[3]!='')
	{
		var id = result[3];
		type = 'error';
		if(typeof result[4]!='undefined' && result[4]!='')
			type = result[4];
		
		if($(id).parents('.mpstep').find('.mp-error').length)
			$(id).parents('.mpstep').find('.mp-error').remove();
		else if($(id).find('.mp-error').length)
			$(id).find('.mp-error').remove();
		if(type=='required')
		{
			$(id).parent().addClass('mp-error-required');
			$('<div class="mp-error alert alert-danger">'+requiredfieldtext+'</div>').insertBefore(id);
		}
		else if(type=='minqty' || type=='maxqty')
		{			
			$('<div class="mp-error alert alert-danger">'+result[1]+'</div>').insertAfter(id);
		}
		else if(type=='limitqty')
		{			
			$(id).append($('<div class="mp-error alert alert-danger">'+result[1]+'</div>'));
		}
		
	}
	else
		showErrorAlert(result[1]);
}
function removeShowErrors()
{
	$('.mp-error').each(function(){
		$(this).remove();
	});
	
}
function getGoogleMapsData(address)
{
	 var address = encodeURIComponent(address);
	$.ajax({
    type: "GET",
    url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&sensor=false&key=AIzaSyBctDG6P382nFyA_CBCZLLODOx54aHH7F8",
    dataType: "json",
    success: processJSON
  }).success(function(data){
    processJSON(data);
  });
}
function processJSON(json) {
    // Do stuff here
    console.log(json);
    var result = '';
    if(typeof (json.results[0]))
    {
    	for(var i=0;i<json.results[0].address_components.length;i++)
    	{
    		if(result!='')
    			result+=' ';
    		result+=json.results[0].address_components[i].long_name;
    	}
    }
    return result;
    //alert("Postal Code:" + json.results[0].address_components[6].long_name);
  }
/* RESET URL FUNCTIONS */
function getMPTitleById(mpgroup,id)
{
	var id_addgroup = mpgroup['id_addgroup'];
	var title = '';
	if(mpgroup['show']=='0')
	{
		return $('#megagroups #megafield_'+id_addgroup+' option[value="' + id + '"]').html();
	}
	else if(mpgroup['show']=='4' && mpgroup['multiselect']=='0')
	{
		return $('#megagroups input:radio[name=megafield_'+id_addgroup+']:checked').attr('title');
		
	}
	else if(mpgroup['show']=='4' && mpgroup['multiselect']=='1')
	{
		return $('[for=mpcheckbox_'+id_addgroup+'_'+id+']').text();	
	}
	else
	{
		var megafield = getMegaField(mpgroup,id_addgroup,id);
		if ($(megafield).attr('title') != "undefined" && $(megafield).attr('title')!='') 
			return $(megafield).attr('title');
		else if($(megafield).attr('data-title') != "undefined" && $(megafield).attr('data-title')!='')
			return  $(megafield).attr('data-title');
		else if($(megafield).html()!='')
			return $(megafield).html();
	}
	return title;
}

function resetGroupsByUrl(urlcode)
{
	if(urlcode=='')
		urlcode = getParameterByName('mpurl');
	if(urlcode!='')
	{
		var arrayGroups = urlcode.split('/');
		if(arrayGroups.length>1)
		{
			for(var i=1;i<arrayGroups.length;i++)
			{
				id_addgroup = 0;
				var group = arrayGroups[i].split('-');
				if(group.length>0)
				{
					id_addgroup = parseInt(group[0]);			
				}
				if(group.length>2)
				{
					for(var j=2;j<group.length;j=j+2)
					{
						id = parseInt(group[j]);
						if(typeof id!='undefined' && !isNaN(id))
						{
							var megagroup = getMPGroupById(id_addgroup);
							selectRuleOptions(megagroup,id);
						}
					}
				}
			}
		}
		findCombination();
	}
	resetUrlMeasures();
}
function findGroupByAttr(id)
{
	if(typeof megaGroups!='undefined' && megaGroups.length>0 )
	{
		for(var i=0;megaGroups.length>i;i++)
		{
			var id_group =megaGroups[i]['id_addgroup'];
			if($('#megafield_'+id_group+' option[value="'+id+'"]').length)
					return megaGroups[i];
		}
		
	}
	return 0;
}
function resetUrlMeasures()
{
	
	var mpquantity = getParameterByName('mpquantity');
	if(typeof mpquantity!='undefined' && mpquantity!='')
	{
		addMPQuantity(mpquantity);
		/*if($('#id_step_quantity').length)
			$('#id_step_quantity').val(mpquantity);
		$('#quantity_wanted').val(mpquantity);*/
	}
	var mpattrs = getParameterByName('search_attrs');
	if(typeof mpattrs!='undefined' && mpattrs!='')
	{
		var attrs = mpattrs.split('-');
		for(var i=0;i<attrs.length;i++)
		{
			var id = attrs[i]; 
			var megagroup = findGroupByAttr(id);
			selectRuleOptions(megagroup,id);
		}
	}
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function updateQueryStringParam(key, value)
{
	  baseUrl = [location.protocol, '//', location.host, location.pathname].join('');
	  urlQueryString = document.location.search;
	  var newParam = key + '=' + value,
	  params = '?' + newParam;

	  // If the "search" string exists, then build params from it
	  if (urlQueryString) {
	    keyRegex = new RegExp('([\?&])' + key + '[^&]*');
	    // If param exists already, update it
	    if (urlQueryString.match(keyRegex) !== null) {
	      params = urlQueryString.replace(keyRegex, "$1" + newParam);
	    } else { // Otherwise, add it to end of query string
	      params = urlQueryString + '&' + newParam;
	    }
	  }
	  window.history.replaceState({}, "", baseUrl + params);
}
function changeFilterMPUrlStatus()
{
	if(typeof _MP!='undefined' && _MP.urls==0)
		return;
	var arrayUrl='';
	var arrayValues = '';
	if(typeof megaGroups!='undefined' && megaGroups.length>0)
	{
		for (i=0; i<megaGroups.length; i++)
		{
			if(typeof megaGroups[i]!='undefined')
			{
				var group = megaGroups[i];
				var id_addgroup = group['id_addgroup']; 
				arrayUrl += '/'+id_addgroup;
				var searchStr = "-";
        var replaceStr = "";
        var re = new RegExp(searchStr, "g");
        		
				if($('#megagroup' + id_addgroup).find('.mega_title').length)
				{
					var gt = $('#megagroup'+id_addgroup).find('.mega_title').html();
					gt = gt.replace(':','');
					gt = gt.replace(' ','_');
					arrayUrl += '-' + encodeURI(gt.toLowerCase());
				}	
				if(typeof group['selections']!='undefined' && group['selections'].length)
				{
					for (var j = 0; j < mpgroup['selections'].length; j++) 
					{
						var id = mpgroup['selections'][j];
						var selectTitle = getMPTitleById(group,id);
						selectTitle = selectTitle.toLowerCase();
						selectTitle = selectTitle.replace(' ','_');
						
        		selectTitle = selectTitle.replace(re, replaceStr);
						//selectTitle = selectTitle.replace('-','');
					//	arrayUrl += '-'+group['selected']+'-'+encodeURIComponent(selectTitle);
						arrayUrl += '-'+id+'-'+encodeURIComponent(selectTitle);
					}				
				}
				else if(typeof group['selected']!='undefined' && group['selected']>0)
				{
					var id = group['selected'];
					var selectTitle = getMPTitleById(group,id);
					if(typeof selectTitle=='undefined')
						selectTitle = '';
					if(selectTitle!='')
					{
						selectTitle = selectTitle.trim().toLowerCase();
						selectTitle = selectTitle.replace('\n','');
						selectTitle = selectTitle.replace(' ','_');
						selectTitle = selectTitle.replace(re, replaceStr);
					}
					arrayUrl += '-'+group['selected']+'-'+encodeURIComponent(selectTitle);	
				}			
			}
		}
	}
	// Measures
	if(arrayUrl.length)
	{
		updateQueryStringParam('mpurl',arrayUrl);
	}
	
	if($('#quantity_wanted').length && $('#quantity_wanted').val()!='')
	{
		updateQueryStringParam('mpquantity',$('#quantity_wanted').val());
	}
	
}
/* END RESET URL FUNCTIONS */
function in_array(id,ids)
{ 
  for (var i in ids) { 
    if (i == id) { 
      return true;
    } 
  }
  return false;
}
function loadMPTicketMail(id_ticket){
	$('#mpSendTicketEmail').show();
	$('#mpSendTicketEmail #id_ticket').val(id_ticket);
	goToByScroll('mpSendTicketEmail');
}
function checkLimitCartQuantities(){
	if($('#mp-quantity-limits').length)
	$.ajax({
		type: 'POST',
		url: baseDir + 'index.php?fc=module&module=megaproduct&controller=ajaxservices',
		async: false,
		cache: false,
		dataType : "html",
		data: '&type=checkcartquantity',
		success: function(jsonData,textStatus,jqXHR)
		{
			$('#mp-quantity-limits').html(jsonData);
			
		}
	});
}
function mpShowCartProducts(){
	$('.mp-cart-info-cart').toggle();
	if($('#mp-icon-open').is(":visible")){
		$('#mp-icon-open').hide();
		$('#mp-icon-close').show();
	} else {
		$('#mp-icon-open').show();
		$('#mp-icon-close').hide();
	}
}
function refreshMPCountdown(id_cart)
{
	$.ajax({
		type: 'POST',
		url: baseDir + 'index.php?fc=module&module=megaproduct&controller=cron&type=refresh&id_cart='+id_cart,
		success: function(jsonData,textStatus,jqXHR)
		{
			location.reload();
		}
	});
}
function getIdCombination(){
	if($('#idCombination').length)
		return parseInt($('#idCombination').val());
	var data = 	$('#product-details').data('product');
	if(typeof data!="undefined")
		return data.id_product_attribute; 
	return 0;	
}