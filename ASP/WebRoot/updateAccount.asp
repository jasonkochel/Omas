<!-- #INCLUDE VIRTUAL="/functions.asp" -->
<%
cMode = Request("Mode")
cUserID = Session("UserID")

Set objUser = Server.CreateObject("Omas.Users")
Set oUser = objUser.Load(cUserID)

If cMode = "Save" Then
	Set oFields = Server.CreateObject("Scripting.Dictionary")
	
	For Each oItem in Request.Form
		oFields(oItem) = Request.Form(oItem)
	Next
	
	cOK = objUser.Save(cUserID, oFields)
	Call CheckError(cOK)
	
	Response.Redirect "menu.asp"
End If
%>
<html>
<head>
<title>OMA's Pride Ordering System</title>
<link rel="stylesheet" type="text/css" href="styles.css">

<script type="text/javascript">
function SubmitRegistration() {
	if (validate_form(contact) != false) {
		document.contact.Mode.value = "Save";
		document.contact.submit();
	}
}

function CancelRegistration() {
	window.location = "menu.asp";
}

function validate_required(field, alerttxt) {
	with (field) {
		if (value==null || value=="") {
			alert(alerttxt);
			return false;
		}
		else {
			return true;
		}
	}
}

function validate_form(thisform) {
	with (thisform) {
		if (
			(validate_required(FName, "Please enter your full name") == false) ||
			(validate_required(LName, "Please enter your full name") == false) ||
			(validate_required(Email, "Please enter your email address") == false) ||
			(validate_required(Phone, "Please enter your phone number") == false) ||
			(validate_required(Password, "Please enter a password") == false)
		) {
			contact.focus(); 
			return false;
		}
	}
}

</script> 
</head>
<body>
<table width="761" border=0 cellspacing=0 cellpadding=0>
<tr>
	<td class="font-content" valign="top" align=center>
		<span class="headerlargegreen"><b>OMA's Pride Ordering System</b></span><br>
		<p>
		<div class="headermediumblue">Please update your contact information below</div>
		<br>
		<TABLE WIDTH="600" BORDER="0" CELLSPACING="0" CELLPADDING="0">
		<tr>
			<td align=center>
				<FORM METHOD="POST" name="contact" ACTION="updateAccount.asp">
				<INPUT TYPE=HIDDEN NAME="Mode" VALUE="Save">
				<TABLE BORDER="0" cellpadding="0" cellspacing="0" class="font-content">
				<TR>
					<TD>First Name:&nbsp;</TD>
					<TD><input type=text value="<%=oUser("FName")%>" maxlength="30" size=30 name="FName" class="formField"></td>
				</TR>
				<TR>
					<TD>Last Name:&nbsp;</TD>
					<TD><input type=text value="<%=oUser("LName")%>" maxlength="30" size=30 name="LName" class="formField"></td>
				</TR>
				<TR>
					<TD>Phone #:&nbsp;</TD>
					<TD><input type=text value="<%=oUser("Phone")%>" maxlength="20" size=20 name="Phone" class="formField"></TD>
				</TR>
				<TR>
					<TD>E-mail:&nbsp;</TD>
					<TD><input type=text value="<%=oUser("Email")%>" maxlength="50" size=50 name="Email" class="formField"></TD>
				</TR>
				<TR>
					<TD>Password:&nbsp;</TD>
					<TD><input type="password" value="<%=oUser("Password")%>" maxlength="20" size=20 name="Password" class="formField"></TD>
				</TR>
				<tr>
				<td colspan="2" align="center" nowrap="nowrap"><img src="/images/blank.gif" width="1" height="20" border="0"><br />
				<INPUT TYPE="Button" Name="Submit" Value="Submit" onClick="javascript: SubmitRegistration();">		
				<input type="button" name="Cancel" value="Cancel" onClick="javascript: CancelRegistration();">
				</form>
			</td>
		</tr>
		</table>
	</td>
</tr>
</table>
</body>
</html>