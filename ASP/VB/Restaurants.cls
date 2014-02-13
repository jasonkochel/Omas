VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 3  'UsesTransaction
END
Attribute VB_Name = "Restaurants"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = True
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = True
Option Explicit
Implements ObjectControl
Dim oContext As ObjectContext

Private Function ObjectControl_CanBePooled() As Boolean
    ObjectControl_CanBePooled = True
End Function

Private Sub ObjectControl_Deactivate()
    Set oContext = Nothing
End Sub

Private Sub ObjectControl_Activate()
    Set oContext = GetObjectContext()
End Sub

Public Function Load(ByVal cRestaurantID As String) As Scripting.Dictionary
        On Error GoTo Err

        Dim cn As ADODB.Connection
        Dim cm As ADODB.Command
        Dim rs As ADODB.Recordset
        Dim oField As ADODB.Field
        Dim oResults As New Scripting.Dictionary

        Set cn = oContext.CreateInstance("ADODB.Connection")
        Set cm = oContext.CreateInstance("ADODB.Command")

        Connect cn
        cm.ActiveConnection = cn
        cm.CommandType = adCmdStoredProc
        cm.CommandText = "RestaurantSelect"
        cm.Parameters.Refresh

        cm("@RestaurantID") = CDbl(cRestaurantID)

        Set rs = cm.Execute

        If Not rs.EOF Then
                For Each oField In rs.Fields
                        oResults.Add oField.Name, oField.Value
                Next
        End If

        Set Load = oResults
        Set oResults = Nothing

        rs.Close
        cn.Close
        Set rs = Nothing
        Set cm = Nothing
        Set cn = Nothing

        oContext.SetComplete
        Exit Function

Err:
        oContext.SetAbort

        CloseRs rs
        CloseCn cn
        Set rs = Nothing
        Set cm = Nothing
        Set cn = Nothing

        oResults.Add "ERR", Err.Description & " in " & Err.Source & " line: " & Erl
        Set Load = oResults
        Set oResults = Nothing

End Function

Public Function LoadAll() As Scripting.Dictionary
        On Error GoTo Err

        Dim cn As ADODB.Connection
        Dim cm As ADODB.Command
        Dim rs As ADODB.Recordset
        Dim oField As ADODB.Field
        Dim oResults As New Scripting.Dictionary
        Dim oRow As Scripting.Dictionary

        Set cn = oContext.CreateInstance("ADODB.Connection")
        Set cm = oContext.CreateInstance("ADODB.Command")

        Connect cn
        cm.ActiveConnection = cn
        cm.CommandType = adCmdStoredProc
        cm.CommandText = "RestaurantsSelectAll"
        Set rs = cm.Execute

        Do Until rs.EOF
                Set oRow = oContext.CreateInstance("Scripting.Dictionary")
                For Each oField In rs.Fields
                        oRow.Add oField.Name, oField.Value
                Next
                oResults.Add CStr(rs("RestaurantID")), oRow
                Set oRow = Nothing
                rs.MoveNext
        Loop

        Set LoadAll = oResults
        Set oResults = Nothing

        rs.Close
        cn.Close
        Set rs = Nothing
        Set cm = Nothing
        Set cn = Nothing

        oContext.SetComplete
        Exit Function

Err:
        oContext.SetAbort

        CloseRs rs
        CloseCn cn
        Set rs = Nothing
        Set cm = Nothing
        Set cn = Nothing

        oResults.Add "ERR", Err.Description & " in " & Err.Source
        Set LoadAll = oResults
        Set oResults = Nothing

End Function

Public Function LoadToday(ByVal cCurrentDay As String) As Scripting.Dictionary
        On Error GoTo Err

        Dim cn As ADODB.Connection
        Dim cm As ADODB.Command
        Dim rs As ADODB.Recordset
        Dim oField As ADODB.Field
        Dim oResults As New Scripting.Dictionary
        Dim oRow As Scripting.Dictionary

        Set cn = oContext.CreateInstance("ADODB.Connection")
        Set cm = oContext.CreateInstance("ADODB.Command")

        Connect cn
        cm.ActiveConnection = cn
        cm.CommandType = adCmdStoredProc
        cm.CommandText = "RestaurantSelectDay"
        cm.Parameters.Refresh

        cm("@Today") = (cCurrentDay)

        Set rs = cm.Execute

        Do Until rs.EOF
          Set oRow = oContext.CreateInstance("Scripting.Dictionary")
          For Each oField In rs.Fields
                  oRow.Add oField.Name, oField.Value
          Next
          oResults.Add CStr(rs("RestaurantID")), oRow
          Set oRow = Nothing
          rs.MoveNext
        Loop

        Set LoadToday = oResults
        Set oResults = Nothing

        rs.Close
        cn.Close
        Set rs = Nothing
        Set cm = Nothing
        Set cn = Nothing

        oContext.SetComplete
        Exit Function

Err:
        oContext.SetAbort

        CloseRs rs
        CloseCn cn
        Set rs = Nothing
        Set cm = Nothing
        Set cn = Nothing

        oResults.Add "ERR", Err.Description & " in " & Err.Source & " line: " & Erl
        Set LoadToday = oResults
        Set oResults = Nothing

End Function
