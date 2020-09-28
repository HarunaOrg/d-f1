
	let progressbar,moneyBar;
	let totalDonations = 0;

	$(document).ready(function() {
	  initCountdown();
	  initBars();
	  initDonors();
	})

	function initCountdown() {
	 let $countdownNumbers = {
	    days: $('#countdown-days'),
	    hours: $('#countdown-hours'),
	    minutes: $('#countdown-minutes'),
	    seconds: $('#countdown-seconds')
	  };
	  var endDate = $('#countdown').attr('target-date');
	  $('#countdown').countdown(endDate, function(event) {
	    $countdownNumbers.days.text(event.offset.totalDays);
	    $countdownNumbers.hours.text(('0' + event.offset.hours).slice(-2));
	    $countdownNumbers.minutes.text(('0' + event.offset.minutes).slice(-2));
	    $countdownNumbers.seconds.text(('0' + event.offset.seconds).slice(-2));
	  });
	}

	const star = '<i class="fa fa-paper-plane-o"></i>';

	function initDonors(){

	  var isDonor = false;
	  $("#donors").html("")
	  var donations = [];
	  for (var i = 0; i < 50; i++) {
	    var total = 10;
	    if (Math.random()>0.5){
	      if (Math.random()>0.5){
	        total = 15;
	      } else {
	        if (Math.random()>0.5){
	          total = 50;
	        } else {
	          total = 100;
	        }
	      }
	    }
	    donations.push({total:total,from:`test-donor-${i}`});
	  }

	  donations.forEach(donor=>{
	    var donorClass = "small-donor";
	    if (donor.total >=100){
	      donorClass="star-donor"
	      donor.from = donor.from+star
	    } else if (donor.total >= 50){
	      donorClass="big-donor"
	    } else if (donor.total >= 15){
	      donorClass="medium-donor"
	    }
	    $("#donors").append(`<span class="${donorClass}"> ${donor.from} </span>`);
	  });
	  if (isDonor){
	    $("#supporters-section h3").html("This campaign will be a success thanks to you!<br><br>Thanks for your donation!</h3>");
	  }
	}

	function initBars(){
	  var colorZero = "#3277a8";
	  var colorComplete = "#f82249";
	  var colorTrail = '#eee';

	  var campaignGoal = parseFloat($("#donate-section").attr("campaign-goal"));
	  totalDonations = campaignGoal*0.6;

	  // var line = new ProgressBar.Line('#progressbar');
	  progressbar = new ProgressBar.Circle('#progressbarPercentage', {
	        // color: '#FCB03C',
	        duration: 3000,
	        strokeWidth: 6,
	        trailWidth: 1,
	        easing: 'easeInOut',
	        trailColor: colorTrail,
	        from: { color: colorZero },
	      to: { color: colorComplete },
	      step: function(state, progressbar, attachment) {
	          progressbar.path.setAttribute('stroke', state.color);
	          var value = Math.round(progressbar.value() * 100);
	        if (value === 0) {
	          progressbar.setText('0%');
	        } else {
	          progressbar.setText(value+"%");
	        }
	        // progressbar.text.style.color = state.color
	      },
	        svgStyle:{
	          height: '500px'
	        },
	        text: {
	          autoStyleContainer: false,
	        }
	    });

	  progressbar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
	  progressbar.text.style.fontSize = '6rem';
	  progressbar.text.style.color = '#FFF';
	  moneyBar = new ProgressBar.Line('#progressbarMoney', {
	      // color: '#FCB03C',
	      duration: 3000,
	      strokeWidth: 6,
	      trailWidth: 1,
	      easing: 'easeInOut',
	      trailColor: colorTrail,
	      from: { color: colorZero },
	    to: { color: colorComplete },
	    step: function(state, moneyBar, attachment) {
	        moneyBar.path.setAttribute('stroke', state.color);
	        var value = Math.round(moneyBar.value() * campaignGoal);
	          $("#donations-info span").html(value)
	          $("#goal-info").html(`Only ${campaignGoal-value} more to the goal!`)
	      // moneyBar.text.style.color = state.color
	    },
	  });
	}

	window.updateBars = function updateBars(force){
	  var campaignGoal = parseFloat($("#donate-section").attr("campaign-goal"));
	  var campaignProgress = 1 - (campaignGoal - totalDonations) / campaignGoal;
	  if (campaignProgress > 1) campaignProgress = 1;
	  if (moneyBar.value() == 0 || force){
	    moneyBar.animate(campaignProgress);
	    progressbar.animate(campaignProgress,function(){
	      if (campaignGoal <= totalDonations){
	        $("#donations-info span").html(totalDonations);
	        $( "#goal-info" ).effect( "drop", {}, 500, ()=>{
	          $("#goal-info").html(`Goal reached and surpassed!`)
	          $( "#goal-info" ).removeAttr( "style" ).hide().fadeIn();
	          $("#goal-info").css("color","#f82249")
	          progressbar.text.style.color = "#f82249"
	        }) ;
	      }
	    });
	    }
	}

	window.addDonation = function(amount){
	    var previousAmount = parseFloat($('#donation-input').val());
	    if (isNaN(previousAmount)){
	        previousAmount=0;
	    }
	    $('#donation-input').val(previousAmount+amount)
	}

	window.donate = function(){
	  var amount = parseFloat($('#donation-input').val());
	  if (!isNaN(amount)){
	      totalDonations+=amount;
	      updateBars(true);
	  }
	}
