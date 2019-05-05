/**
 * Created by Islam on 30.04.2019.
 */

$(document).ready(function () {

    var StateProcesses = [$('#state-progress1'), $('#state-progress2'), $('#state-progress3'), $('#state-progress4')];

    var States = [$('#state1'), $('#state2'), $('#state3'), $('#state4')];

    var DispatchCity = $('#dispatch-city');
    var DispatchDate = $('#dispatch-date');
    var ArrivalCity = $('#arrival-city');
    var ArrivalDate = $('#arrival-date');

    var Form = $('#form');
    var FlightSchedule = $('#flight-schedule');
    var FlightNumberEdit = $('#flight-number-edit');
    var FlightNumberInput = $('#flight-number-input');

    var OneWayCheckbox = $('#oneway-checkbox');

    var DispatchCitySelect = $('#dispatch-city-select');
    var ArrivalCitySelect = $('#arrival-city-select');

    var FormSubmit = $('#form-submit');

    var CountAdults;
    var CountChildren;
    var CountBabies;
    var FlightClass = 'Эконом';

    var PaymentMethod;

    var SetState = function (State) {
        $(StateProcesses).each(function () {
            this.removeClass('current-state');
        });

        StateProcesses[State].addClass('current-state');

        $(States).each(function () {
            this.hide();
        });

        if(State !== 3)
            for(var i = 0; i <= State; i++){
                States[i].show();
            }
        else States[3].show();

        FormSubmit.hide();
    };

    function FlightNumberEditEnable(f) {
        if(f){
            FlightNumberEdit.click(function () {
                Form.hide();
                FlightSchedule.show();
                CheckFlightNumber();
            });
            FlightNumberEdit.removeClass('flight-number-edit-unactive');
            FlightNumberEdit.addClass('flight-number-edit-active');
        }
        else{
            FlightNumberEdit.unbind('click');
            FlightNumberEdit.removeClass('flight-number-edit-active');
            FlightNumberEdit.addClass('flight-number-edit-unactive');
        }
        if(FlightNumberInput.val()) FlightNumberInput.show();
        else  FlightNumberInput.hide();
    }

    function CheckState(){
        if(DispatchCity.val() && ArrivalCity.val() && DispatchDate.val()
            && (OneWayCheckbox.is(":checked")||ArrivalDate.val())){
            SetState(0);
            FlightNumberEditEnable(true);
            if(FlightNumberInput.val()){
                SetState(1);
                if(CountAdults  >= 1){
                    SetState(2);
                    if(PaymentMethod) FormSubmit.show();
                }
            }
        }
        else{
            FlightNumberEditEnable(false);
            SetState(0);
        }
    }

    DispatchCity.keyup(function () {
        Filter('dispatch-city', 'dispatch-city-select');
    });

    DispatchCity.focus(function() {
        Filter('dispatch-city', 'dispatch-city-select');
        DispatchCitySelect.show();
        DispatchCity.css('border-radius', '10px 10px 0 0')
    });

    DispatchCity.focusout(function() {
        window.setTimeout(function() {
            DispatchCitySelect.hide();
            DispatchCity.css('border-radius', '10px');
            if(!IsContain('dispatch-city', 'dispatch-city-select'))
                DispatchCity.val('');
            FlightNumberInput.val('');
            SelectedFlight = undefined;
            FlightScheduleTable.find('input').prop('checked', false);
            CheckState();
        }, 150);
    });

    DispatchCitySelect.find('li').not('.emptyMessage').click(function() {
        DispatchCity.val(
            this.querySelector('.reservation-form__input-city-select-name')
                .innerText);
        FlightNumberInput.val('');
        SelectedFlight = undefined;
        FlightScheduleTable.find('input').prop('checked', false);
        CheckState();
    });

    ArrivalCity.keyup(function () {
        Filter('arrival-city', 'arrival-city-select');
    });

    ArrivalCity.focus(function() {
        Filter('arrival-city', 'arrival-city-select');
        ArrivalCitySelect.show();
        ArrivalCity.css('border-radius', '10px 10px 0 0')
    });

    ArrivalCity.focusout(function() {
        window.setTimeout(function() {
            ArrivalCitySelect.hide();
            ArrivalCity.css('border-radius', '10px');
            if(!IsContain('arrival-city', 'arrival-city-select'))
                ArrivalCity.val('');
            FlightNumberInput.val('');
            SelectedFlight = undefined;
            FlightScheduleTable.find('input').prop('checked', false);
            CheckState();
        }, 150);
    });

    ArrivalCitySelect.find('li').not('.emptyMessage').click(function() {
        ArrivalCity.val(
            this.querySelector('.reservation-form__input-city-select-name')
                .innerText);
        FlightNumberInput.val('');
        SelectedFlight = undefined;
        FlightScheduleTable.find('input').prop('checked', false);
        CheckState();
    });


    var Filter = function (input, select) {
        var filter = document.getElementById(input).value.toUpperCase();

        var ul = document.getElementById(select);
        var li = ul.getElementsByTagName("li");

        for (var i = 0; i < li.length; i++) {
            var element = li[i].getElementsByClassName('reservation-form__input-city-select-name')[0];
            var value = element.textContent || element.innerText;
            if (value.toUpperCase().indexOf(filter) > -1)
                li[i].style.display = "";
            else
                li[i].style.display = "none";
        }
    };

    /**
     * @return {boolean}
     */
    var IsContain = function (input, select) {
        var filter = document.getElementById(input).value.toUpperCase();

        var ul = document.getElementById(select);
        var li = ul.getElementsByTagName("li");

        var f = false;
        for (var i = 0; i < li.length; i++) {
            var element = li[i].getElementsByClassName('reservation-form__input-city-select-name')[0];
            var value = element.textContent || element.innerText;
            value = value.split('\n')[0].toUpperCase();
            if (value === filter){
                f = true;
                break;
            }
        }

        return f;
    };

    $.datepicker.setDefaults(
        $.extend(
            $.datepicker.regional['ru']
        )
    );

    DispatchDate.datepicker({
        dateFormat: 'd M yy',
        minDate: 0,
        onSelect: function(date){
            ArrivalDate.datepicker( "option", "minDate", DispatchDate.datepicker("getDate") );
            FlightNumberInput.val('');
            SelectedFlight = undefined;
            FlightScheduleTable.find('input').prop('checked', false);
            CheckState();
        }
    });

    ArrivalDate.datepicker({
        dateFormat: 'd M yy',
        minDate: 0,
        onSelect: function(date){
            DispatchDate.datepicker( "option", "maxDate", ArrivalDate.datepicker("getDate") );
            FlightNumberInput.val('');
            SelectedFlight = undefined;
            FlightScheduleTable.find('input').prop('checked', false);
            CheckState();
        }
    });

    OneWayCheckbox.change(function() {
        if($(this).is(":checked")){
            DispatchDate.datepicker( "option", "maxDate", null);
            ArrivalDate.hide();
        }
        else {
            FlightNumberInput.val('');
            SelectedFlight = undefined;
            DispatchDate.datepicker( "option", "maxDate", ArrivalDate.datepicker("getDate") );
            FlightScheduleTable.find('input').prop('checked', false);
            ArrivalDate.show();
        }
        CheckState();
    });

    var SelectAdults = $('#select-adults');
    var SelectChildren = $('#select-children');
    var SelectBabies = $('#select-babies');
    var SelectClass = $('#select-class');

    SelectAdults.selectmenu();
    SelectChildren.selectmenu();
    SelectBabies.selectmenu();
    SelectClass.selectmenu();

    SelectAdults.on('selectmenuchange', function() {
        CountAdults = SelectAdults.val();
        CheckState();
    });

    SelectChildren.on('selectmenuchange', function() {
        CountChildren = SelectChildren.val();
    });

    SelectBabies.on('selectmenuchange', function() {
        CountBabies = SelectBabies.val();
    });

    SelectClass.on('selectmenuchange', function() {
        FlightClass = SelectClass.val();
    });

    States[2].find('input').click(function () {
        PaymentMethod = $(this).attr('id');
        CheckState();
    });

    var ChooseFlightNumberButtonBack = $('#choose-flight-number-button-back');
    var ChooseFlightNumberButtonConfirm = $('#choose-flight-number-button-confirm');

    ChooseFlightNumberButtonBack.click(function () {
        Form.show();
        FlightSchedule.hide();
    });


    var FlightScheduleTable = $('#flight-schedule-table');
    var SelectedFlight;

    FlightScheduleTable.find('tbody').find('tr').not('.emptyMessage').click(function() {
        $(this).find('td input:radio').prop('checked', true);
        SelectedFlight = $(this).find('td')[1].innerText;
        CheckFlightNumber();
    });

    function CheckFlightNumber() {
        if(SelectedFlight){
            ChooseFlightNumberButtonConfirm.click(function () {
                Form.show();
                FlightSchedule.hide();
                FlightNumberInput.val(SelectedFlight);
                FlightNumberInput.show();
                CheckState();
            });
            ChooseFlightNumberButtonConfirm.removeClass('flight-schedule__confirm-unactive');
            ChooseFlightNumberButtonConfirm.addClass('flight-schedule__confirm-active');
        }
        else{
            ChooseFlightNumberButtonConfirm.unbind('click');
            ChooseFlightNumberButtonConfirm.removeClass('flight-schedule__confirm-active');
            ChooseFlightNumberButtonConfirm.addClass('flight-schedule__confirm-unactive');
        }
    }

    var ReservationResultMessage = $('#reservation-result-message');

    FormSubmit.click(function () {
        //Тут типа код ajax
        var ServerResponseIsGood = true;
        if(ServerResponseIsGood){
            //Все норм, оповещаем пользователя
            SetState(3);

            var str = "Рейс №: " + FlightNumberInput.val() + '\n';
            str += "Города отправки/прибытия: " + DispatchCity.val() + " - " + ArrivalCity.val() + '\n';

            str += OneWayCheckbox.is(":checked") ?
                'Дата отправки: ' + DispatchDate.val() + '\n' :
                'Дата отправки/возвращения: ' + DispatchDate.val() + '/' + ArrivalDate.val() + '\n';

            str += 'Информация о пассажирах: ' + CountAdults + ' взрослых';
            if(CountChildren > 0) str += ', ' + CountChildren + ' детей';
            if(CountBabies > 0) str += ', ' + CountBabies + ' младенцев';

            str += '\n';

            str += 'Класс: ' + FlightClass + '\n';

            str += 'Оплата: ';
            if(PaymentMethod === 'radio-card') str += 'платиковой картой';
            if(PaymentMethod === 'radio-cash') str += 'наличными';
            if(PaymentMethod === 'radio-cashless') str += 'безналичный расчет';

            ReservationResultMessage.text(str);
        }
        else{
            //Обработка эксепшена
        }
    })
});