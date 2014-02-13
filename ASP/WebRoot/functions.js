bUSLocale = true;

function trim(val) {
	startposn = 0;
	while ((val.charAt(startposn) == " ") && (startposn < val.length)) {
		startposn++;
	}
	if (startposn == val.length) {
		val="";
	} else {
		val = val.substring(startposn,val.length);
		endposn = (val.length) - 1;
		while (val.charAt(endposn) == " ") {
			endposn--;
		}
		val = val.substring(0, endposn + 1);
	}
	return (val);
}

function empty(string) {
	return (trim(string).length == 0);
}

function jsleft(string, len) {
	return string.substr(0,len);
}

function jsright(string, len) {
	pos = string.length - len;
	return string.substr(pos);
}

function formatNumber(nNum, nDec, lLeading, lAllowBlank, lBlankZero) {
	cRet = "";
	cPre = "0";
	cPost = "";

	cNum = nNum.toString();

	if (cNum.indexOf(".") == -1) {
		cPre = cNum;
	} else {
		cPre = cNum.substr(0, cNum.indexOf("."));
		cPost = cNum.substr(cNum.indexOf(".") + 1);
	}

	if (!lBlankZero) {
		if (cPre.valueOf() == "") {
			if (lLeading)
				cRet = "0";
			else
				cRet = "";
		} else {
			cRet = cPre;
		}
	} else {
		if (cPre.valueOf() == 0 && cPre.substr(0,1) != "-") {
			if (lLeading)
				cRet = "0";
			else
				cRet = "";
		} else {
			cRet = cPre;
		}
	}

	if (cPost.length > nDec)
		cPost = cPost.substr(cPost, nDec);

	if (!(lAllowBlank && cRet.valueOf() == "" && cPost.valueOf() == ""))
		 {
		for (i = cPost.length; i < nDec; i++)
			cPost = cPost + "0";

		if (nDec > 0)
			cRet = cRet + "." + cPost;
		}

	return cRet;
}


function formatPercentage(nNum, nDec, lLeading) {
	cRet = "";
	cPre = "0";
	cPost = "";

	cZero = ".";

	for (i = 0; i < nDec; i++)
		cZero = cZero + "0";

	cNum = nNum.toString();

	while (cNum.substr(0,1) == "0")
	{
		cNum = cNum.substr(1);
	}

	if (cNum.indexOf(".") == -1) {
		cNum = cNum + cZero.substr(0, nDec + 1);
	}
	nIndex = cNum.indexOf(".");
	if (nNum > 1 && nNum < 10) {
		cPost = "0" + cNum.substr(0,1) + cNum.substr(nIndex + 1,nDec - 2);
	}
	else {
		if (nNum >= 10 && nNum < 100) {
			cPost = cNum.substr(0,2) + cNum.substr(nIndex + 1, nDec - 2);
		}
		else {
			if (nNum == 100) {
				cPre = "1";
				cPost =  cZero.substr(1, nDec);
			}
			else {
				cPre = cNum.substr(0, nIndex);
				cPost = cNum.substr(nIndex + 1, nDec);
			}
		}
	}

	if (cPre.valueOf() == 0) {
		if (lLeading)
			cRet = "0";
		else
			cRet = "";
	} else {
		cRet = cPre;
	}

	if (cPost.length > nDec)
		cPost = cPost.substr(cPost, nDec);

	for (i = cPost.length; i < nDec; i++)
		cPost = cPost + "0";

	if (nDec > 0)
		cRet = cRet + "." + cPost;

	return cRet;
}

function vUCaseKey(oField) {
	cChar = String.fromCharCode(event.keyCode);
	if (cChar == cChar.toLowerCase()) {
		cChar = cChar.toUpperCase();
		event.keyCode = cChar.charCodeAt(0);
	}
}

function vICapBlur(oField) {
	if (oField.readOnly || oField.disabled) return true;
	oField.value = oField.value.charAt(0).toUpperCase() + oField.value.substr(1);
}

function vICapKey(oField) {

	if (oField.readOnly || oField.disabled)
		return true;

	cText = oField.value;
	if (cText.length == 0) {
		event.keyCode = String.fromCharCode(event.keyCode).toUpperCase().charCodeAt(0);
	}
}

function stripZero(cString) {
	//while (cString.substr(0,1) == "0")
	while (jsleft(cString,1) == "0")
		cString = cString.substr(1);
	return cString;
}

function FebDays(nYear) {
	if (nYear % 4 != 0)
		return 28;
	if (nYear % 400 == 0)
		return 29;
	if (nYear % 100 == 0)
		return 28;
	else
		return 29;
}

function isDate(cMonth, cDay, cYear) {
	var aMonths = new Array();
	aMonths[1] = 31;
	aMonths[2] = 28;
	aMonths[3] = 31;
	aMonths[4] = 30;
	aMonths[5] = 31;
	aMonths[6] = 30;
	aMonths[7] = 31;
	aMonths[8] = 31;
	aMonths[9] = 30;
	aMonths[10] = 31;
	aMonths[11] = 30;
	aMonths[12] = 31;

	nMonth = parseInt(stripZero(cMonth),10);
	nDay   = parseInt(stripZero(cDay),10);
	nYear  = parseInt(stripZero(cYear),10);

	// verify all are valid #s
	if (isNaN(nMonth) || isNaN(nDay) || isNaN(nYear))
		return false;

	// verify month in range
	if (nMonth < 1 || nMonth > 12)
		return false;

	// verify year in range
	if (nYear < 1800 || nYear > 9999)
		return false;

	// verify days in range for month
	if (nMonth == 2) {
		if (nDay < 1 || nDay > FebDays(nYear))
			return false;
	} else {
		if (nDay < 1 || nDay > aMonths[nMonth])
			return false;
	}

	return true;
}

function isTime(cHour, cMinute) {
	nHour   = parseInt(cHour,10);
	nMinute = parseInt(cMinute,10);

	// verify both are valid #s
	if (isNaN(nHour) || isNaN(nMinute))
		return false;

	// verify hour in range
	if (nHour < 1 || nHour > 12)
		return false;

	// verify minute in range
	if (nMinute < 0 || nMinute > 59)
		return false;

	return true;
}

function vDateBlur(oField) {
	if (oField.readOnly || oField.disabled) return true;

	lOK = true;

	// check for empty input
	if (empty(oField.value))
		return true;

	// break date down and validate
	if (bUSLocale)
	{
		aDate = oField.value.split("/");
		switch(aDate.length) {
			case 1:
				// no slashes entered, so we infer their location
				switch(aDate[0].length) {
					case 4:
						aDate[2] = new Date().getFullYear().toString();
						aDate[1] = jsright(aDate[0],2);
						aDate[0] = jsleft(aDate[0],2);
						lOK = isDate(aDate[0],aDate[1],aDate[2]);
						break;
					case 6:
						nYear = parseInt(jsright(aDate[0],2),10);
						if (nYear >= 0 && nYear < 50) {
							nYear += 2000;
						} else {
							if (nYear < 100)
								nYear += 1900;
						}
						aDate[2] = nYear.toString();
						aDate[1] = aDate[0].substr(2,2);
						aDate[0] = jsleft(aDate[0],2);
						lOK = isDate(aDate[0],aDate[1],aDate[2]);

						break;
					case 8:
						aDate[2] = jsright(aDate[0],4);
						aDate[1] = aDate[0].substr(2,2);
						aDate[0] = jsleft(aDate[0],2);
						lOK = isDate(aDate[0],aDate[1],aDate[2]);
						break;
					default:
						lOK = false;
				}
				break;
			case 2:
				// only month and day entered, infer year
				aDate[2] = new Date().getFullYear().toString();
				lOK = isDate(aDate[0],aDate[1],aDate[2]);
				break;
			case 3:
				// full date entered
				nYear = parseInt(aDate[2],10);

				if (nYear >= 0 && nYear < 50) {
					nYear += 2000;
				} else {
					if (nYear < 100)
						nYear += 1900;
				}
				aDate[2] = nYear.toString();
				lOK = isDate(aDate[0],aDate[1],aDate[2]);
				break;
			default:
				lOK = false;
		}

		// handle valid or invalid
		if (lOK) {
			oField.value = jsright("00" + aDate[0],2) + "/" + jsright("00" + aDate[1],2) + "/" + aDate[2];
		} else {
			alert("Invalid Date");
			oField.focus();
		}
	}
	else
	{
		aDate = oField.value.split("/");
		switch(aDate.length) {
			case 1:
				// no slashes entered, so we infer their location
				switch(aDate[0].length) {
					case 4:
						aDate[2] = new Date().getFullYear().toString();
						aDate[1] = jsright(aDate[0],2);
						aDate[0] = jsleft(aDate[0],2);
						lOK = isDate(aDate[1],aDate[0],aDate[2]);
						break;
					case 6:
						nYear = parseInt(jsright(aDate[0],2),10);
						if (nYear >= 0 && nYear < 50) {
							nYear += 2000;
						} else {
							if (nYear < 100)
								nYear += 1900;
						}
						aDate[2] = nYear.toString();
						aDate[1] = aDate[0].substr(2,2);
						aDate[0] = jsleft(aDate[0],2);
						lOK = isDate(aDate[1],aDate[0],aDate[2]);

						break;
					case 8:
						aDate[2] = jsright(aDate[0],4);
						aDate[1] = aDate[0].substr(2,2);
						aDate[0] = jsleft(aDate[0],2);
						lOK = isDate(aDate[1],aDate[0],aDate[2]);
						break;
					default:
						lOK = false;
				}
				break;
			case 2:
				// only month and day entered, infer year
				aDate[2] = new Date().getFullYear().toString();
				lOK = isDate(aDate[1],aDate[0],aDate[2]);
				break;
			case 3:
				// full date entered
				nYear = parseInt(aDate[2],10);

				if (nYear >= 0 && nYear < 50) {
					nYear += 2000;
				} else {
					if (nYear < 100)
						nYear += 1900;
				}
				aDate[2] = nYear.toString();
				lOK = isDate(aDate[1],aDate[0],aDate[2]);
				break;
			default:
				lOK = false;
		}

		// handle valid or invalid
		if (lOK) {
			oField.value = jsright("00" + aDate[0],2) + "/" + jsright("00" + aDate[1],2) + "/" + aDate[2];
		} else {
			alert("Invalid Date");
			oField.focus();
		}
	}
}

function vDateKeyDown(oField) {
	if (!oField.readOnly) {
		if (event.keyCode == 33 || event.keyCode == 34) {
			//show calendar window if user hits Page Up or Page Down
			vDateCalendar(oField);
		} else if (event.keyCode == 38 || event.keyCode == 40) {
			//up, down move date backward, forward one day (or hold Ctrl to move one month)
			if (oField.value.length == 10){
				cFieldValue = oField.value;

				if (bUSLocale)
				{
					cDay = cFieldValue.substr(3, 2)
					cMonth = cFieldValue.substr(0, 2)
					cYear = cFieldValue.substr(6, 4)
				}
				else
				{
					cMonth = cFieldValue.substr(3, 2)
					cDay = cFieldValue.substr(0, 2)
					cYear = cFieldValue.substr(6, 4)
				}

				if (isDate(cMonth, cDay, cYear)) {
					if (event.keyCode == 38) {nIncrement = 1} else {nIncrement = -1}
					var myDate=new Date();
					if (event.ctrlKey){
						if (parseInt(cMonth) == 12 && nIncrement == 1)
							myDate.setFullYear(parseInt(cYear) + 1, 0, cDay);
						else if (parseInt(cMonth) == 1 && nIncrement == -1) {
							myDate.setFullYear(cYear - 1, 11, cDay);
						} else {
							myDate.setFullYear(cYear, cMonth - 1 + nIncrement, cDay);
						}
					} else {
						myDate.setFullYear(cYear, cMonth - 1, cDay);
						myDate.setDate(myDate.getDate() + nIncrement);
					}
					nMonth = myDate.getMonth() + 1;
					nDay = myDate.getDate();
					nYear = myDate.getYear();

					vPlaceDateInField(oField, nDay, nMonth, nYear);

					event.returnValue = false;
				} else {event.returnValue = false;}
			}
		}
	} else {event.returnValue = false;}
}

function vDateContextMenu(oField) {
	vDateCalendar(oField);
	return false;
}

function vDateCalendar(oField) {
	if (!oField.readOnly) {
		cURL = "/calendar.asp?SelectedDate=" + oField.value;
		cNewDate = window.showModalDialog(cURL, "CalWin", "dialogWidth=230px;dialogheight=320px;center=yes;border=thin;help=no;status=no");

		if (cNewDate !== '' && typeof(cNewDate) !== 'undefined') {
			oField.value = cNewDate;
		} else {
			if (!oField.readonly)
				oField.focus;
		}
		vDateBlur(oField);
	}
}

function vPlaceDateInField(oField, nDay, nMonth, nYear){
	if (bUSLocale)
	{
		oField.value = jsright("00" + nMonth,2) + '/' + jsright("00" + nDay,2) + '/' + nYear;
	}
	else
	{
		oField.value = jsright("00" + nDay,2) + '/' + jsright("00" + nMonth,2) + '/' + nYear;
	}
}

function vGetDateInField(oField) {
	if (bUSLocale)
	{
		return new Date(oField.value);
	}
	else
	{
		aDate = oField.value.split("/");
		return new Date(aDate[2], aDate[1] - 1, aDate[0]);
	}
}

function vDateKey(oField) {
	var cValid = "0123456789/";
	cChar = String.fromCharCode(event.keyCode);
	if ( (cChar == "t" || cChar == "T") && !oField.readOnly ) { //if user presses T, then select today
		dToday = AdjustTime(new Date());
		nMonth = dToday.getMonth()+1;
		nDay = dToday.getDate();
		nYear = dToday.getYear();

		vPlaceDateInField(oField, nDay, nMonth, nYear);

		event.returnValue = false;
	}
	else if (cChar == "d" || cChar == "D" && !oField.readOnly ) {
		if (oField.value.length == 0 )
			dCurrentDate = new Date();
		else
			dCurrentDate = vGetDateInField(oField);

		dCurrentDate.setTime(dCurrentDate.getTime() + (1000*60*60*24));
		nMonth = dCurrentDate.getMonth() + 1;
		nDay = dCurrentDate.getDate();
		nYear = dCurrentDate.getYear();

		vPlaceDateInField(oField, nDay, nMonth, nYear);

		event.returnValue = false;
	} else if (cChar == "w" || cChar == "W" && !oField.readOnly ) {

		if (oField.value.length == 0 )
			dCurrentDate = new Date();
		else
			dCurrentDate = vGetDateInField(oField);

		dCurrentDate.setTime(dCurrentDate.getTime() + (1000*60*60*24*7));
		nMonth = dCurrentDate.getMonth() + 1;
		nDay = dCurrentDate.getDate();
		nYear = dCurrentDate.getYear();

		vPlaceDateInField(oField, nDay, nMonth, nYear);

		event.returnValue = false;
	} else if ((cChar == "m" || cChar == "M") && !oField.readOnly ) {

		if (oField.value.length == 0 )
			dCurrentDate = new Date();
		else
			dCurrentDate = vGetDateInField(oField);

		nMonth = dCurrentDate.getMonth() + 2;
		nDay = dCurrentDate.getDate();

		if (nMonth > 12)
		{
			nMonth = 1;
			nYear = dCurrentDate.getYear() + 1;
		}
		else
		{
			nYear = dCurrentDate.getYear();
		}

		vPlaceDateInField(oField, nDay, nMonth, nYear);

		event.returnValue = false;
	} else if ((cChar == "y" || cChar == "Y") && !oField.readOnly ) {

		if (oField.value.length == 0 )
			dCurrentDate = new Date();
		else
			dCurrentDate = vGetDateInField(oField);

		nMonth = dCurrentDate.getMonth() + 1;
		nDay = dCurrentDate.getDate();
		nYear = dCurrentDate.getYear() + 1;

		vPlaceDateInField(oField, nDay, nMonth, nYear);

		event.returnValue = false;
	}

	else if (cValid.indexOf(cChar) == -1) {
		event.returnValue = false;
	}
}

function vDurBlur(oField) {
	if (oField.readOnly || oField.disabled) return true;
	cTime = oField.value;

	if (empty(cTime))
		return;

	nColon = cTime.indexOf(":");
	if (nColon == -1) {
		nHour = parseInt(cTime, 10);
		nMinute = 0;
		// change "15" to "00:15", etc
		if (nHour >= 5) {
			nNewHour = Math.floor(nHour / 100);
			nMinute = nHour % 100;
			nHour = nNewHour;

			if (nMinute > 59) {
				nHour = nHour + Math.floor(nMinute / 60);
				nMinute = nMinute % 60;
			}
		}
	} else {
		nHour = parseInt(jsleft(cTime, nColon),10);
		nMinute = parseInt(cTime.substr(nColon+1),10);

		if (isNaN(nHour)) {
			nHour = 0;
		}
		if (isNaN(nMinute)) {
			nMinute = 0;
		}

		if (nMinute > 59) {
			nHour = nHour + Math.floor(nMinute / 60);
			nMinute = nMinute % 60;
		}
	}
	if (nHour < 0 || nMinute < 0 || nMinute > 59) {
		alert("Invalid Duration");
		oField.focus();
	} else {
		oField.value = jsright("00" + nHour,2) + ":" + jsright("00" + nMinute,2);
	}
}

function vRoDurBlur(oField) {
	if (oField.readOnly || oField.disabled) return true;
	cTime = oField.value;

	if (empty(cTime))
		return;

	nColon = cTime.indexOf(":");
	if (nColon == -1) {
		nHour = parseInt(cTime, 10);
		nMinute = 0;
	} else {
		nHour = parseInt(jsleft(cTime, nColon),10);
		nMinute = parseInt(cTime.substr(nColon+1),10);

		if (isNaN(nHour)) {
			nHour = 0;
		}
		if (isNaN(nMinute)) {
			nMinute = 0;
		}

		if (nMinute > 59) {
			nHour = nHour + Math.floor(nMinute / 60);
			nMinute = nMinute % 60;
		}
	}
	if (nHour < 0 || nMinute < 0 || nMinute > 59) {
		alert("Invalid Duration");
		oField.focus();
	} else {
		oField.value = jsright("00" + nHour,2) + ":" + jsright("00" + nMinute,2);
	}
}

function vDurKey(oField) {
	var cValid = "0123456789:";
	cChar = String.fromCharCode(event.keyCode);
	if (cValid.indexOf(cChar) == -1)
		event.returnValue = false;
}

function vIPAddressBlur(oField) {
	if (oField.readOnly || oField.disabled) return true;
	cValue = oField.value;

	if (empty(cValue))
		return;

	cArray = cValue.split(".");

	nArrayLength = cArray.length;

	lTooBig = false;

	for (i = 0; i < nArrayLength; i++)
		{
		if (cArray[i].length == 0)
			{
			cArray[i] = "0";
			}

		if (parseInt(cArray[i],10) < 0 || parseInt(cArray[i],10) > 255)
			lTooBig = true;
		}

	if (nArrayLength != 4 || lTooBig) {
		alert("Please enter a valid IP address (XXX.XXX.XXX.XXX)");
		oField.focus();
	} else {
		oField.value = cArray.join(".");
	}
}

function vIPAddressKey(oField) {
	var cValid = "0123456789.";
	cChar = String.fromCharCode(event.keyCode);
	if (cValid.indexOf(cChar) == -1)
		event.returnValue = false;
}

function vNumBlur(oField, nWidth, nDec, lLead, lNegative, lAllowBlank, lBlankZero) {
	if (oField.readOnly || oField.disabled) return true;
	if (nDec == 0)
		cBefore = nWidth.toString();
	else
		//cBefore = (nWidth - (nDec + 1)).toString();
		cBefore = (nWidth - nDec).toString(); //don't count "." against total # of digits -dbb 12/14/07

	oField.value = trim(oField.value);

	cDec = nDec.toString();
	if (lNegative)
		cMask = "^(-)?\\d{0," + cBefore + "}(\\.\\d{0," + cDec + "})?$";
	else
		cMask = "^\\d{0," + cBefore + "}(\\.\\d{0," + cDec + "})?$";

	oRegExp = new RegExp(cMask);
	if (!oRegExp.test(oField.value)) {
		alert("Invalid format: Use " + nWidth.toString() + " digits with " +
		                               nDec.toString() + " decimal places");
		oField.focus();
	} else {
		if (oField.value !== "" || !lAllowBlank)
			oField.value = formatNumber(oField.value, nDec, lLead, lAllowBlank, lBlankZero);
	}
}

function vNumKey(oField, cNegative) {
	if (cNegative == "1")
		cValid = "0123456789.-";
	else
		cValid = "0123456789.";

	cChar = String.fromCharCode(event.keyCode);
	if (cValid.indexOf(cChar) == -1)
		event.returnValue = false;
}

function vOrderNumListKey(oField) {
	cValid = "0123456789,";

	cChar = String.fromCharCode(event.keyCode);
	nChar = event.keyCode;

	if (cValid.indexOf(cChar) == -1 && nChar != 13)
		event.returnValue = false;
}

function vPercentageBlur(oField, nDec) {
	if (oField.readOnly || oField.disabled) return true;
	nNum = oField.value;
	cNum = nNum.toString();

	if (nNum > 100 || (cNum.indexOf(".") != cNum.lastIndexOf("."))) {
		alert("Invalid format: Enter XX percent as XX or .XX");
		oField.focus();
	}
	else {
		oField.value = formatPercentage(nNum, nDec, true);
	}
}

function vPercentageKey(oField) {
	var cValid = "0123456789.";
	cChar = String.fromCharCode(event.keyCode);
	if (cValid.indexOf(cChar) == -1)
		event.returnValue = false;
}

function vPhoneFocus(oField, cAreaCode) {
	// Disable for Swingle and Termapest
	if (typeof cCustomFlag == "undefined")
		cCustomFlag = "";

	if (cCustomFlag == "SWINGLE" || cCustomFlag == "TERMAPEST")
		return;

	if (empty(oField.value) && !empty(cAreaCode) && cAreaCode != "0")
		{
		oField.value = cAreaCode + "-";
		cTextRange = oField.createTextRange();
		cTextRange.collapse(false);
		cTextRange.select();
		}
}

function vPhoneBlur(oField, cAreaCode) {

	if (oField.readOnly || oField.disabled) return true;
	// Disable validation for Termapest
	if (typeof cCustomFlag == "undefined")
		cCustomFlag = "";

	if (cCustomFlag == "TERMAPEST")
		return;

	cValue = oField.value;

	if (cValue == cAreaCode + '-') {
		oField.value = "";
		return;
	}

	if (empty(cValue))
		return;

	cDigits = "";
	for (i = 0; i < cValue.length; i++)
		if (!isNaN(cValue.charAt(i)))
			cDigits += cValue.charAt(i);

	if (bUSLocale)
	{
		if (cDigits.length != 10)
		{
			alert("Please enter a full phone number (XXX-XXX-XXXX)");
			oField.focus();
		}
		else
		{
			oField.value = jsleft(cDigits,3) + "-" + cDigits.substr(3, 3) + "-" + jsright(cDigits,4);
		}
	}
	else
	{
		switch(cLocaleID)
		{
			case 16393: //en-in
				if (cDigits.length == 10)
				{
					oField.value = cDigits
				}
				else if (cDigits.length == 11)
				{
					oField.value = jsleft(cDigits,3) + "-" + jsright(cDigits,8);
				}
				else
				{
					alert("Please enter a full phone number (XXX-XXXXXXXX) or (XXXXXXXXXX)");
					oField.focus();
				}
				break;
			case 3081: //en-au
				if (cDigits.length != 10)
				{
					alert("Please enter a full phone number (XX-XXXX-XXXX) or (XXXX-XXX-XXX)");
					oField.focus();
				}
				else if (jsleft(cDigits,2) == "04")
				{
					oField.value = jsleft(cDigits,4) + "-" + cDigits.substr(3, 3) + "-" + jsright(cDigits,3);
				}
				else
				{
					oField.value = jsleft(cDigits,2) + "-" + cDigits.substr(2, 4) + "-" + jsright(cDigits,4);
				}
				break;
		}
	}
}

function vPhoneKey(oField) {
	// Disable validation for Termapest
	if (typeof cCustomFlag == "undefined")
		cCustomFlag = "";

	if (cCustomFlag == "TERMAPEST")
		return;

	cValid = "0123456789-";

	cChar = String.fromCharCode(event.keyCode);
	if (cValid.indexOf(cChar) == -1)
		event.returnValue = false;
}

function vTimeBlur(oField, cAmPm) {
	if (typeof cCustomFlag == "undefined")
		cCustomFlag = "";

	if (oField.readOnly || oField.disabled) return true;
	cTime = oField.value;

	if (empty(cTime)) {
		// cAmPm will be blank in some cases. TP 11-17-2010 FB 6756
		if (cAmPm !== '') {
		 oAmPm = document.all(cAmPm);
		 setSelect(oAmPm, "AM");
		}
		return;
	 }

	// added to support military (24-hour) time
	// if user enters exactly 4 digits with no colon, assume military time
	// use the first 2 digits to determine AM or PM  -jek 12/23/08
	lMilitary = false;
	cMilAmPm  = "AM";

	nColon = cTime.indexOf(":");

	if (nColon == -1) {
		if (cTime.length == 4) {
			nHour = jsleft(cTime,2);
			nMinute = cTime.substr(2);
			// Arrow American (123062) doesn't want to use this feature  -jek 5/20/09
			if (cCustomFlag != 'ARROWAMERICAN')
				lMilitary = true;
		}

		if (cTime.length == 3) {
			nHour = jsleft(cTime,1);
			nMinute = cTime.substr(1);
		}

		if (cTime.length == 1 || cTime.length == 2 || cTime.length == 5) {
			nHour = parseInt(cTime,10);
			nMinute = 0;
		}
	} else {
		nHour = jsleft(cTime, nColon);
		nMinute = cTime.substr(nColon+1);
	}

	if (lMilitary) {
		if (nHour == 0) {
			nHour = 12;
			cMilAmPm = "AM";
		} else if (nHour == 12) {
			cMilAmPm = "PM"
		} else if (nHour > 12) {
			nHour = nHour - 12;
			cMilAmPm = "PM"
		}
	}

	if (nHour < 1 || nHour > 12 || nMinute < 0 || nMinute > 59) {
		alert("Invalid Time");
		oField.focus();
	} else {
		oField.value = jsright("00" + nHour,2) + ":" + jsright("00" + nMinute,2);
		if (!empty(cAmPm)) {
			oAmPm = document.all(cAmPm);

			// Added for Anderson to default 5 or 6 to AM.  MH 3-16-06
			// Added so 5 defaults to PM for AnytimeEndTime on ServiceSetups. -VB 10-10-2006
			if (typeof cCustomFlag == "undefined")
				cCustomFlag = "";

			if ((cCustomFlag == "ANDERSON" || cCustomFlag == "RMTERMITE") && oField.name != "AnytimeEndTime" ) {
				nHr = 5;
			} else if (cCustomFlag == "TITAN334182") {
				nHr = 6;
			} else {
				nHr = 7;
			}

			if (lMilitary)
				setSelect(oAmPm, cMilAmPm);
			else if (nHour == 12 || nHour < nHr)
				setSelect(oAmPm, "PM");
			else
				setSelect(oAmPm, "AM");
		}
	}
}

function vTimeKeyDown(oField, cAmPm) {
	if (!oField.readOnly) {
		if (event.keyCode == 38 || event.keyCode == 40) {
			//up, down move minute backward, forward one day (or hold Ctrl to move one hour)
			cFieldValue = oField.value;

			if (cFieldValue.length == 4 || cFieldValue.length == 5){
				if (cFieldValue.length == 4)
					cFieldValue = "0" + cFieldValue;

				oAmPm = document.all(cAmPm);

				cHours = cFieldValue.substr(0, 2);
				cMinutes = cFieldValue.substr(3, 2);

				if (isTime(cHours, cMinutes)) {
					if (event.keyCode == 38) {nIncrement = 1} else {nIncrement = -1}

					var myTime = new Date();
					myTime.setHours(cHours);
					myTime.setMinutes(cMinutes);

					dNewTime = myTime;

					if (event.ctrlKey)
						dNewTime.setHours(dNewTime.getHours() + nIncrement);
					else
						dNewTime.setMinutes(dNewTime.getMinutes() + nIncrement);

					if (dNewTime.getHours() == 13)
						dNewTime.setHours(1);
					else if (dNewTime.getHours() == 0)
						dNewTime.setHours(12);
					else if ((dNewTime.getHours() == 12 && cHours !== "12") || (dNewTime.getHours() == 11 && cHours == "12")) {
						if (oAmPm !== null) {
							if (oAmPm.value == 'AM')
								setSelect(oAmPm, "PM");
							else
								setSelect(oAmPm, "AM");
						}
					}

					oField.value = jsright("00" + dNewTime.getHours(),2) + ':' + jsright("00" + dNewTime.getMinutes(),2);
					event.returnValue = false;
				} else {event.returnValue = false;}
			}
		}
	} else {event.returnValue = false;}
}

function vTimeKey(oField, cAmPm) {
	var cValid = "0123456789:";
	cChar = String.fromCharCode(event.keyCode);
	if ( (cChar == "t" || cChar == "T") && !oField.readOnly ) { //if user presses T, then select today
		//respect employee's AdjustTime setting -dbb 6/23/08
		//dNow = new Date();
		dNow = AdjustTime(new Date());
		//
		nHour = dNow.getHours();
		nMin = dNow.getMinutes();

		oAmPm = document.all(cAmPm);
		if (nHour <= 12) {
			setSelect(oAmPm, "AM");
		} else {
			nHour = nHour - 12;
			setSelect(oAmPm, "PM");
		}
		oField.value = jsright("00" + nHour,2) + ':' + jsright("00" + nMin,2);
		event.returnValue = false;
	} else if (cValid.indexOf(cChar) == -1) {
		event.returnValue = false;
	}
}

function vYearBlur(oField) {
	if (oField.readOnly || oField.disabled) return true;
	lOK = true;

	// check for empty input
	if (empty(oField.value))
		lOK = false;

	else {
	// validate year
	  nYear = parseInt(oField.value, 10);
		if (nYear >= 0 && nYear < 50) {
			nYear += 2000;
		} else {
			 if (nYear < 100)
				nYear += 1900;
		}
		lOK = (nYear > 1000 && nYear < 9999);
	}

	// handle valid or invalid
	if (lOK) {
		oField.value = nYear;
	} else {
		alert("Invalid Year");
		oField.focus();
	}
}

function vYearKey(oField) {
	var cValid = "0123456789";
	cChar = String.fromCharCode(event.keyCode);
	if (cValid.indexOf(cChar) == -1)
		event.returnValue = false;
}

function vTextareaKey(oField, MaxLength) {
	nLen = oField.value.length;
	if (nLen >= MaxLength)
		event.returnValue = false;
}

function vTextareaBlur(oField, nMaxLength, nLines) {
	if (oField.readOnly || oField.disabled) return true;
	oField.value = jsleft(oField.value, nMaxLength);
}

function vTextareaKeyDown(oField, nMaxLength, nLines) {
	if (event.keyCode == 13 && nLines !== -1) {
		var cStr = oField.value;
		aStr = cStr.split('\r');
		if (aStr.length > (nLines - 1)) {
			event.returnValue = false;
		}
	}
}

function vYesNoKey(oField) {
	var cValid = "YyNn";
	cChar = String.fromCharCode(event.keyCode);

	if (cValid.indexOf(cChar) == -1)
		event.returnValue = false;

	if (cChar == cChar.toLowerCase()) {
		cChar = cChar.toUpperCase();
		event.keyCode = cChar.charCodeAt(0);
	}
}

function vDayOfYearBlur(oField) {
	if (oField.readOnly || oField.disabled) return true;
	lOK = true;

	// check for empty input
	if (empty(oField.value))
		return true;

	// break date down and validate
	aDate = oField.value.split("/");
	switch(aDate.length) {
		case 1:
			// no slash entered, so we infer its location
			switch(aDate[0].length) {
				case 4:
					aDate[1] = jsright(aDate[0],2);
					aDate[0] = jsleft(aDate[0],2);

					if (bUSLocale)
					{
						lOK = isDate(aDate[0],aDate[1],"1901");
					}
					else
					{
						lOK = isDate(aDate[1],aDate[0],"1901");
					}

					break;
				default:
					lOK = false;
			}
			break;
		case 2:
			// month and day entered
			if (bUSLocale)
			{
				lOK = isDate(aDate[0],aDate[1],"1901");
			}
			else
			{
				lOK = isDate(aDate[1],aDate[0],"1901");
			}

			break;
		default:
			lOK = false;
	}

	// handle valid or invalid
	if (lOK) {
		oField.value = jsright("00" + aDate[0],2) + "/" + jsright("00" + aDate[1],2);
	} else {
		alert("Invalid Date");
		oField.focus();
	}
}

function vDayOfYearKey(oField) {
	var cValid = "0123456789/";
	cChar = String.fromCharCode(event.keyCode);
	if (cValid.indexOf(cChar) == -1)
		event.returnValue = false;
}

function AdjustTime(dDate)
{
    if (nAdjustTime == undefined)
    {
        var nAdjustTime = 0;
    }
	dNewDate = dDate
	dNewDate.setHours(dNewDate.getHours() + nAdjustTime)

	return dNewDate;
}

