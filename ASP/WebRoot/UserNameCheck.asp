<!-- #INCLUDE VIRTUAL="/functions.asp" -->
<%
Response.ContentType = "text/xml"

Set oXML2 = Server.CreateObject("Microsoft.XMLDOM")
oXML2.async = False
oXML2.load(Request)

cEmail = oXML2.documentElement.selectSingleNode("Email").text

Set objUser = Server.CreateObject("Omas.Users")
Set oUser = objUser.LoadByEmail(cEmail)
Call CheckDictError(oUser)

If oUser.Count = 0 Then
	cResult = "OK"
Else
	cResult = "FAIL"
End If
%><?xml version="1.0"?><response><UserCount><%=cResult%></UserCount></response>