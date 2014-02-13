<!-- #INCLUDE VIRTUAL="/functions.asp" -->
<%
Call CheckAdminLogin

cMode = Request("Mode")
cUserID = Session("UserID")

Set objUser = Server.CreateObject("Omas.Users")

If cMode = "Open" Then
	Set objOrder = Server.CreateObject("Omas.Orders")
	cOK = objOrder.InsertBatch(Request.Form("OrderDate"), Request.Form("DeliveryDate"))
	Call CheckError(cOK)
	Session("BatchID") = objOrder.GetCurrentBatch()
	Response.Redirect "adminMenu.asp"
End If
%>
<html>
<head>
<title>OMA's Pride Ordering System</title>
<link rel="stylesheet" type="text/css" href="styles.css">

<script type="text/javascript" src="functions.js"></script>
<script type="text/javascript">
function SubmitForm() {
	if (batch.OrderDate.value == "" || batch.DeliveryDate.value == "") {
		alert("Please enter an order-by and pick-up-on date");
	}
	else {
		document.batch.submit();
	}
}

function CancelForm() {
	window.location = "adminMenu.asp";
}
</script> 
</head>
<body>
<table width="761" border=0 cellspacing=0 cellpadding=0>
<tr>
	<td class="font-content" valign="top" align=center>
		<span class="headerlargegreen"><b>OMA's Pride Ordering System</b></span><br>
		<p>
		<div class="headermediumblue">Open Ordering</div>
		<br>
		<TABLE WIDTH="600" BORDER="0" CELLSPACING="0" CELLPADDING="0">
		<tr>
			<td align=center>
				<FORM METHOD="POST" name="batch" ACTION="openOrdering.asp">
				<INPUT TYPE=HIDDEN NAME="Mode" VALUE="Open">
				<TABLE BORDER="0" cellpadding="0" cellspacing="0" class="font-content">
				<TR>
					<TD>Order By:</TD>
					<TD><input type=text maxlength="10" size=10 name="OrderDate" class="formField" <%=VClass("Date","")%>></TD>
				</TR>
				<TR>
					<TD>Pick Up On:</TD>
					<TD><input type=text maxlength="10" size=10 name="DeliveryDate" class="formField" <%=VClass("Date","")%>></TD>
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