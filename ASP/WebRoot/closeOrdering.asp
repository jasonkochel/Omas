<!-- #INCLUDE VIRTUAL="/functions.asp" -->
<%
Call CheckAdminLogin

cMode = Request("Mode")
cUserID = Session("UserID")

Set objUser = Server.CreateObject("Omas.Users")
Set objOrder = Server.CreateObject("Omas.Orders")

If cMode = "Close" Then
	cOK = objOrder.CloseBatch(Session("BatchID"))
	Call CheckError(cOK)
	Session("BatchID") = objOrder.GetCurrentBatch()
	Response.Redirect "adminMenu.asp"
End If

Set oBatch = objOrder.LoadBatch(Session("BatchID"))
Set objOrder = Nothing
%>
<html>
<head>
<title>OMA's Pride Ordering System</title>
<link rel="stylesheet" type="text/css" href="styles.css">

<script type="text/javascript" src="functions.js"></script>
<script type="text/javascript">
function SubmitForm() {
	document.batch.submit();
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
		<div class="headermediumblue">Close Ordering</div>
		<br>
		<TABLE WIDTH="600" BORDER="0" CELLSPACING="0" CELLPADDING="0">
		<tr>
			<td align=center>
				<FORM METHOD="POST" name="batch" ACTION="closeOrdering.asp">
				<INPUT TYPE=HIDDEN NAME="Mode" VALUE="Close">
				<TABLE BORDER="0" cellpadding="0" cellspacing="0" class="font-content">
				<tr>
				<td colspan="2" align="center" nowrap="nowrap"><img src="/images/blank.gif" width="1" height="20" border="0">
				<br />
				<INPUT TYPE="Button" Name="Submit" Value="Close Ordering" onClick="javascript: SubmitForm();">		
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