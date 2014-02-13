<!-- #INCLUDE VIRTUAL="/functions.asp" -->
<%
Call CheckAdminLogin

cMode = Request("Mode")
cUserID = Session("UserID")

Set objUser = Server.CreateObject("Omas.Users")

If cMode = "Retrieve" Then
	Set oUsers = objUser.LoadByEmail(Request("Email"))
	If oUsers.Count = 0 Then
		cMode = "NotFound"
	Else
		For Each oItem In oUsers
			Set oUser = oUsers(oItem)
			cMode = "Found"
			cPassword = oUser("Password")
		Next
	End If
End If
%>
<html>
<head>
<title>OMA's Pride Ordering System</title>
<link rel="stylesheet" type="text/css" href="styles.css">

<script type="text/javascript">
function SubmitForm() {
	if (contact.Email.value == "")
		alert("Please enter an e-mail address");
	else
		document.contact.submit();
}

function CancelForm() {
	window.location = "default.asp";
}
</script> 
</head>
<body>
<table width="761" border=0 cellspacing=0 cellpadding=0>
<tr>
	<td class="font-content" valign="top" align=center>
		<span class="headerlargegreen"><b>OMA's Pride Ordering System</b></span><br>
		<p>
		<% 
		If cMode = "NotFound" Then
			%>
			<div Class="headersmallblue">The e-mail address you entered was not found.</div><br>
			<%
		ElseIf cMode = "Found" Then
			%>
			<div Class="headersmallblue">The password is <%=cPassword%></div><br>
			<%
		End If
		%>
		<div class="headermediumblue">Enter an e-mail address below to retrieve the password</div>
		<br>
		<TABLE WIDTH="600" BORDER="0" CELLSPACING="0" CELLPADDING="0">
		<tr>
			<td align=center>
				<FORM METHOD="POST" name="contact" ACTION="adminForgotPassword.asp">
				<INPUT TYPE=HIDDEN NAME="Mode" VALUE="Retrieve">
				<TABLE BORDER="0" cellpadding="0" cellspacing="0" class="font-content">
				<TR>
					<TD>E-mail:&nbsp;</TD>
					<TD><input type=text maxlength="50" size=50 name="Email" class="formField"></TD>
				</TR>
				<tr>
				<td colspan="2" align="center" nowrap="nowrap"><img src="/images/blank.gif" width="1" height="20" border="0"><br />
				<INPUT TYPE="Button" Name="Submit" Value="Submit" onClick="javascript: SubmitForm();">		
				<input type="button" name="Cancel" value="Cancel" onClick="javascript: CancelForm();">
				</form>
			</td>
		</tr>
		</table>
	</td>
</tr>
</table>
</body>
</html>