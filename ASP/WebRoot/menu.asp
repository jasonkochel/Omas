<!-- #INCLUDE VIRTUAL="/functions.asp" -->
<%
Call CheckLogin

cMode = Request("Mode")
cUserID = Session("UserID")

Set objUser = Server.CreateObject("Omas.Users")
Set oUser = objUser.Load(cUserID)
Set objUser = Nothing

Set objOrder = Server.CreateObject("Omas.Orders")
Set oBatch = objOrder.LoadBatch(Session("BatchID"))
Set objOrder = Nothing

If Em(oUser("FName")) Or Em(oUser("LName")) Or Em(oUser("Phone")) Or Em(oUser("Email")) Then
	Response.Redirect "updateAccount.asp"
End If
%>
<html>
<head>

<title>OMA's Pride Ordering System</title>
<link rel="stylesheet" type="text/css" href="styles.css">

<style type="text/css">
BODY, TD {
	font-family: Arial;
	font-size: 12px;
}
.secheader {
	background-color: black;
	color: white;
	font-size: 14px;
	font-weight: bold;
}
.colheader {
	background-color: #aaaaaa;
	font-size: 12px;
	font-weight: bold;
}
.shadedrow {
	background-color: #cccccc;
}
</style>

</head>
<body>

<table width="761" border=0 cellspacing=0 cellpadding=0>
<tr>
	<td class="font-content" valign="top" align=center>
		<span class="headerlargegreen"><b>OMA's Pride Ordering System</b></span><br>
		<p>
		<div class="headermediumred">Welcome, <%=oUser("FName") & " " & oUser("LName")%></div>
		<p>
		<%
		If oBatch("IsOpen") Then
			%>
			<div class="headermediumblue">
			<a href="orderForm.asp">Place or Update My Order</a>
			<p>
			<a href="orderSummary.asp">View My Order</a>
			<p>
			<a href="updateAccount.asp">Update My Information or Password</a>
			</div>
			<%
		Else
			%>
			<div class="headermediumred" style="font-weight: bold;">Ordering is closed</div>
			<%
		End If

		If oUser("Admin") Then
			%>
			<div class="headermediumblue">
			<p>
			<a href="adminMenu.asp">Administrator Menu</a>
			</div>
			<%
		End If
		%>
	</td>
</tr>
</table>
</body>
</html>