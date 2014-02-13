<%
Sub CheckAdminLogin()
	Call CheckLogin

	Set objUser = Server.CreateObject("Omas.Users")
	Set oUser = objUser.Load(Session("UserID"))
	Set objUser = Nothing

	If Not oUser("Admin") Then
		Response.Redirect "default.asp"
	End If
End Sub

Sub CheckLogin()
	If Em(Session("UserID")) Then
		Response.Redirect "default.asp"
	End If
End Sub

Sub AmPmList(cSelected)
	Response.Write "<option value='AM'"
	If cSelected = "AM" Then Response.Write " selected"
	Response.Write ">AM<option value='PM'"
	If cSelected = "PM" Then Response.Write " selected"
	Response.Write ">PM</select>"
End Sub

Sub CheckDictError(ByRef oDict)
	If oDict.Exists("ERR") Then
		Response.Write oDict("ERR")
		Response.End
	End If
End Sub

Sub CheckError(cString)
	If Left(cString, 3) = "ERR" Then
		Response.Write cString
		Response.End
	End If
End Sub

Function Checkbox(cCheck)
    If Em(cCheck) Then
        Checkbox = 0
    Else
        Checkbox = cCheck
    End If
End Function

Function Coalesce(cString1, cString2)
	If IsNull(cString1) Then
		cString1 = ""
	End if
	If IsNull(cString2) Then
		cString2 = ""
	End if
	If Not Em(cString1) Then
		Coalesce = cString1
	Else
		Coalesce = cString2
	End If
End Function

Function Em(cString)
	Em = (Len(Trim(cString)) = 0)
End Function

Function FormatAmPm(dTime)
    If Em(dTime) Or IsNull(dTime) Then
        FormatAmPm = ""
	ElseIf Hour(dTime) = 0 And Minute(dTime) = 0 Then
		FormatAmPm = ""
		Exit Function
    Else
		nHour = Hour(dTime)
		If nHour > 11 Then
		  FormatAmPm = "PM"
		Else
		  FormatAmPm = "AM"
		End If
    End If
End Function

Function FormatCheckbox(nvalue)
  Select Case nvalue
    Case True
      FormatCheckbox = "Yes"
    Case Else
      FormatCheckbox = "No"
  End Select
End Function

Function FormatDate(dDate)
	If Em(dDate) Or Year(dDate) <= 1900 Or IsNull(dDate) Then
		FormatDate = ""
	Else
		FormatDate = DatePart("m", dDate) & "/" & _
								 DatePart("d", dDate) & "/" & _
								 DatePart("yyyy", dDate)
	End If
End Function

Function FormatDateLetter(dDate)
	If Em(dDate) Or Year(dDate) <= 1900 Or IsNull(dDate) Then
		FormatDateLetter = ""
	Else
		FormatDateLetter = MonthName(DatePart("m", dDate)) & " " & _
		                   DatePart("d", dDate) & ", " & _
		                   DatePart("yyyy", dDate)
	End If
End Function

Function FormatDateLong(dDate)
	If Em(dDate) Or Year(dDate) = 1900 Or IsNull(dDate) Then
		FormatDateLong = ""
	Else
		FormatDateLong = WeekDayName(Weekday(dDate)) & ", " & _
		                 MonthName(DatePart("m", dDate)) & " " & _
		                 DatePart("d", dDate) & ", " & _
		                 DatePart("yyyy", dDate)
	End If
End Function

Function FormatDateShort(dDate)
	If Em(dDate) Or Year(dDate) <= 1900 Or IsNull(dDate) Then
		FormatDateShort = ""
	Else
		FormatDateShort = Right("0" & DatePart("m", dDate),2) & "/" & _
		             	  Right("0" & DatePart("d", dDate),2) & "/" & _
		             	  Right(DatePart("yyyy", dDate),2)
	End If
End Function

Function FormatMinToDur(nMin)
	nHours = Int(nMin / 60)
	cHours = Right("00" & nHours,2)
	nMinutes = nMin Mod 60
	cMinutes = Right("00" & nMinutes,2)
	FormatMinToDur = cHours & ":" & cMinutes
End Function

Function FormatNull(nNum)
	If IsNull(nNum) Then
		FormatNull = 0
	Else
		FormatNull = nNum
	End If
End Function

Public Function FormatPhone(cPhoneNumber)
	If Len(cPhoneNumber) = 10 Then
		FormatPhone = Left(cPhoneNumber, 3) & "-" & Mid(cPhoneNumber,4,3) & "-" & Right(cPhoneNumber,4)
	ElseIf Len(cPhoneNumber) = 7 Then
		FormatPhone = Left(cPhoneNumber, 3) & "-" & Right(cPhoneNumber,4)
	Else
		FormatPhone = cPhoneNumber
	End if
End Function

Function FormatTime(dTime)
	If Em(dTime) Then
        	FormatTime = ""
		Exit Function
	End If
	If IsNull(dTime) Then
        	FormatTime = ""
		Exit Function
	End If
	If Hour(dTime) = 0 And Minute(dTime) = 0 Then
        	FormatTime = ""
		Exit Function
	End If
	nHour = Hour(dTime)
	If nHour > 12 Then nHour = nHour - 12
	cHour = CStr(nHour)
	If nHour = 0 Then cHour = "12"
	cHours = Right("00" & cHour,2)
	nMinutes = Minute(dTime)
	cMinutes = Right("00" & nMinutes,2)
	FormatTime = cHours & ":" & cMinutes
End Function

Function Max(nOne, nTwo)
	If nOne > nTwo Then
		Max = nOne
	Else
		Max = nTwo
	End If
End Function

Public Function PadR(cString, cLength)
    PadR = Left(cString & Space(cLength), cLength)
End Function

Function Shorten(cString, n)
	aString = Split(cString, " ")
	If UBound(aString) < (n - 1) Then
		n = UBound(aString) + 1
	End If

	nString = ""
	For nI = 0 To n - 1
		nString = nString & aString(nI) & " "
	Next

	Shorten = nString
End Function

Function StripHTML(myStr)
	StrLen = Len(myStr)
	If IsNull(StrLen) Or IsNull(myStr) Then
		StripHTML = ""
		Exit Function
	End If
	myNewStr = ""
	For i=1 to StrLen
		myChar = Mid(myStr, i, 1)
		If myChar = "<" Then
			Skip = 0
			j = i
			Do While myChar <> ">" And j + skip <= StrLen
				myNewStr = myNewStr & ""
				myChar = Mid(myStr, j + skip, 1)
				Skip = Skip + 1
			Loop
			i = i + Skip - 1

		Else
			myNewStr = myNewStr + myChar
		End If
	Next
	StripHTML = myNewStr
End Function

Function StripSPANandFONT(cString)
	cRet = ""
	lInTag = False
	For nI = 1 To Len(cString)
		cChar = Mid(cString, nI, 1)
		Select Case cChar
			Case "<"
				If UCase(Mid(cString, nI + 1, 4)) = "SPAN" Or _
				   UCase(Mid(cString, nI + 2, 4)) = "SPAN" Or _
				   UCase(Mid(cString, nI + 1, 4)) = "FONT" Or _
				   UCase(Mid(cString, nI + 2, 4)) = "FONT" Or _
				   UCase(Mid(cString, nI + 1, 4)) = "?XML" Or _
				   UCase(Mid(cString, nI + 1, 2)) = "O:" Or _
				   UCase(Mid(cString, nI + 1, 1)) = "H" Or _
				   UCase(Mid(cString, nI + 2, 1)) = "H" Then
					lInTag = True
				Else
					cRet = cRet & cChar
				End If
			Case ">"
				If lInTag Then
					lInTag = False
				Else
					cRet = cRet & cChar
				End If
			Case Else
				If Not lInTag Then
					cRet = cRet & cChar
				End If
		End Select
	Next
	StripSPANandFONT = cRet
End Function

Function AdminCheckLogin
	If (Session("Admin") = False) Then
		Response.Redirect "/restaurant.asp"
	End if
End Function

Function VClass(cClass, cParams)
	If Not Em(cParams) Then
		aParams = Split(cParams, "|")
	End If

	cClass = LCase(cClass)

	Select Case cClass
		Case "date"
			VClass = "onblur='javascript: vDateBlur(this)' onkeypress='javascript: vDateKey(this)'"
		Case "ucase"
			VClass = "onkeypress = 'javascript: vUCaseKey(this)'"
		Case "icap"
			VClass = "onblur='javascript: vICapBlur(this)' onkeypress='javascript: vICapKey(this)'"
		Case "commrate"
			VClass = "onblur='javascript: vCommrateBlur(this, " & aParams(0) & "," & aParams(1) & ")' onkeypress='javascript: vCommrateKey(this)'"
		Case "dur"
			VClass = "onblur='javascript: vDurBlur(this)' onkeypress='javascript: vDurKey(this)'"
		Case "ipaddress"
			VClass = "onblur='javascript: vIPAddressBlur(this)' onkeypress='javascript: vIPAddressKey(this)'"
		Case "num"
			' aParams(0) - Precision
			' aParams(1) - Decimal
			' aParams(2) - Leading Zero
			' aParams(3) - Allow Negative Numbers
			' aParams(4) - Allow Blank
			' aParams(5) - Blank Zero

			VClass = "onblur='javascript: vNumBlur(this, " & aParams(0) & "," & aParams(1) & "," & aParams(2) & "," & aParams(3) & "," & aParams(4) & "," & aParams(5) & ")' onkeypress='javascript: vNumKey(this,"& aParams(3) & ")'"
		Case "smsnum"
			VClass = "onblur='javascript: vSMSNumBlur(this, " & aParams(0) & "," & aParams(1) & "," & aParams(2) & "," & aParams(3) & "," & aParams(4) & "," & aParams(5) & ")' onkeypress='javascript: vNumKey(this,"& aParams(3) & ")'"
		Case "percentage"
			VClass = "onblur='javascript: vPercentageBlur(this, " & aParams(0) & ")' onkeypress='javascript: vPercentageKey(this)'"
		Case "phone"
			VClass = "onblur='javascript: vPhoneBlur(this, """ & cParams & """)' onkeypress='javascript: vPhoneKey(this)' onfocus='javascript: vPhoneFocus(this, """ & cParams & """)'"
		Case "time"
			VClass = "onblur='javascript: vTimeBlur(this, """ & aParams(0) & """)' onkeypress='javascript: vTimeKey(this)'"
		Case "timesheet"
			VClass = "onblur='javascript: vTimesheetBlur(this, " & aParams(0) & "," & aParams(1) & ")' onkeypress='javascript: vTimesheetKey(this)'"
		Case "year"
			VClass = "onblur='javascript: vYearBlur(this)' onkeypress='javascript: vYearKey(this)'"
		Case "textarealimited"
			vClass = "onmouseout='javascript: vTextareaLimited(this, " & aParams(0) & ")' onmouseover='javascript: vTextareaLimited(this, " & aParams(0) & ")' onmouseup='javascript: vTextareaLimited(this, " & aParams(0) & ")' onfocus='javascript: vTextareaLimited(this, " & aParams(0) & ")' onblur='javascript: vTextareaLimited(this, " & aParams(0) & ")' onkeyup='javascript: vTextareaLimited(this, " & aParams(0) & ")' onkeydown='javascript: vTextareaLimited(this, " & aParams(0) & ")'"
		Case "limited"
			vClass = "onblur='javascript: vTextareaBlur(this, " & aParams(0) & "," & aParams(1) & ")' onkeypress='javascript: vTextareaKey(this, " & aParams(0) &")' onkeydown='javascript: vTextareaKeyDown(this, " & aParams(0) & "," & aParams(1) & ")'"
		Case "ordernumlist"
			VClass = "onkeypress='javascript: vOrderNumListKey(this)'"
		Case "taxid"
			VClass = "onblur='javascript: vTaxIDBlur(this)' onkeypress='javascript: vTaxIDKey(this)'"
		Case "1099"
			VClass = "onkeypress='javascript: v1099TypeKey(this)'"
		Case "yesno"
			VClass = "onkeypress='javascript: vYesNoKey(this)'"
	End Select
End Function

Function LastDay(ByVal cMonth, ByVal cYear)
        cMonth = Right("0"&Trim(cMonth), 2)
        cYear  = Right(cYear, 2)
        Select Case cMonth
          Case "01", "03", "05", "07", "08", "10", "12"
            LastDay = "31"
          Case "02"
            If cYear = "88" or cYear = "92" or cYear = "96" or cYear = "00" or cYear = "00" Then
              LastDay = "29"
            Else
              LastDay = "28"
            End If
          Case "04", "06", "09", "11"
            LastDay = "30"
        End Select
End Function

Function ReplaceQuotes(cStr)
	nLen = Len(cStr)
	bInTag = False
	For nI = 1 To nLen
		cChar = Mid(cStr, nI, 1)
		If cChar = "<" Then
			bInTag = True
		End If
		If cChar = ">" Then
			bInTag = False
		End If
		If cChar = """" Then
			If bInTag Then
				cChar = "'"
			Else
				cChar = "&quot;"
			End If
		End If
		cNewText = cNewText + cChar
	Next
	ReplaceQuotes = cNewText
End Function

Sub CheckRSError(ByRef oRecordset)
	If TypeName(oRecordset) <> "Recordset" Then
		Response.Write "Error - Input not a recordset"
		Response.End
	Else
		On Error Resume Next
		Err.Clear
		cIntStatus = oRecordset.Fields("ERR").Status
		
		If Err.Number = 0 Then
			Response.Write oRecordset("ERR")
			Response.End
		End If
		On Error GoTo 0
	End If
End Sub
%>