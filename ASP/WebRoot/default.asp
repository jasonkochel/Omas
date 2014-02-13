<!-- #INCLUDE VIRTUAL="/functions.asp" -->
<%
cMode = Request("Mode")
cEmail = Request("Email")
cPassword = Request("Password")

If Request.Cookies("OmasOrders")("UserRemember") = "1" Then
	bUserRemember = True
	cCookieEmail = Request.Cookies("OmasOrders")("Email")
	cCookiePassword = Request.Cookies("OmasOrders")("Password")
End If

If cMode = "Logout" Then
	Session("UserID") = ""
	Response.Redirect "default.asp"
End if

If cMode = "Login" Then
	Set objUser = Server.CreateObject("Omas.Users")
	Set oUser = objUser.Login(cEmail, cPassword)
	CheckDictError(oUser)

	If oUser.Count = 0 Then
		cMessage = "Invalid e-mail address or password."
	Else
		If Request("UserRemember") = "1" Then
			Response.Cookies("OmasOrders")("UserRemember") = "1"
			Response.Cookies("OmasOrders")("Email") = Request("Email")
			Response.Cookies("OmasOrders")("Password") = Request("Password")
			Response.Cookies("OmasOrders").Expires = "Jan 18, 2038"
		Else
			Response.Cookies("OmasOrders")("UserRemember") = ""
		End If

		Session("UserID") = oUser("UserID")

		Response.Redirect "menu.asp"
	End If
End If

Set objOrder = Server.CreateObject("Omas.Orders")
Session("BatchID") = objOrder.GetCurrentBatch()
Set oBatch = objOrder.LoadBatch(Session("BatchID"))
Set objOrder = Nothing
%>
<html>
<head>
<title>OMA's Pride Ordering System</title>
<link rel="stylesheet" type="text/css" href="styles.css">

<script type="text/javascript">

function SubmitLogin()
{
	document.contact.Mode.value = "Login";
	document.contact.submit();
}

function onload()
{
	<%
	If Em(cCookieEmail) Then
		%>
		document.all['Email'].focus();
		<%
	Else
		%>
		document.all['Login'].focus();
		<%
	End If
	%>
}
</script> 

<table width="761" border=0 cellspacing=0 cellpadding=0>
<tr>
	<td align=center class="font-content" valign="top">
		<span class="headerlargegreen"><b>OMA's Pride Ordering System</b></span><br>
		<br><br>
		<TABLE WIDTH="600" BORDER="0" CELLSPACING="0" CELLPADDING="0">
		<tr>
			<td align=center>
				<%
				If oBatch("IsOpen") Then
					%>
					<div class="headermediumred">Next Order: Due by <%=oBatch("OrderDate")%>, Delivery on <%=oBatch("DeliveryDate")%></div>
					<%
				Else
					%>
					<div class="headermediumred" style="font-weight: bold;">Ordering is Currently Closed</div>
					<%
				End If
				%>
				<p>
				<div class="headermediumblue">If this is your first visit, <a href="register.asp">register for an account</a></div>
				<p>
				<div class="headermediumblue">If you already have an account, log in</div>
				<% 
				If Request("Mode") = "Registered" Then
					%>
					<div Class="headersmallblue">Your account has successfully been created/updated.  Please log in below.</div><br>
					<%
				ElseIf Request("Mode") = "PasswordSent" Then
					%>
					<div Class="headermediumred">Your password has been e-mailed to you.</div><br>
					<%
				ElseIf Not Em(cMessage) Then
					%>
					<div Class="headersmallblue"><%=cMessage%></div><br>
					<%
				End If
				%>
				<FORM METHOD="POST" name="contact" ACTION="default.asp">
				<INPUT TYPE=HIDDEN NAME="Mode" VALUE="Login">
				<TABLE BORDER="0" cellpadding="0" cellspacing="0" class="font-content">
				<TR><TD>E-Mail Address: </TD><TD><input type=text value="<%=cCookieEmail%>" maxlength="50" size=30 name="Email" class="formField"></TD></TR>
				<TR><TD>Password: </TD><TD><input type="password" value="<%=cCookiePassword%>" maxlength="20" size=20 name="Password" class="formField"></TD></TR>
				<TR><TD>Remember Me:</TD><TD><input type="checkbox" name="UserRemember" value="1" value="<%=bUserRemember%>" <%if bUserRemember Then Response.Write(" checked") End if%>></TD></TR>
				<td colspan="2" align="center" nowrap="nowrap"><img src="/images/blank.gif" width="1" height="20" border="0"><br />
				<INPUT TYPE="Button" Name="Login" Value="Log In" onClick="javascript: SubmitLogin();">
				</form>
				<div class="headermediumblue">If you forgot your password, <a href="forgotPassword.asp">click here</a></div>
				<br>
				
				</td>
			</tr>
		</table>
	</td>
</tr>
</table>

For any technical questions or issues with this site, e-mail <a href="mailto:jason@kochel.name">Jason Kochel</a>
</body>
</html>