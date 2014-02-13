Attribute VB_Name = "Globals"
Public Sub Connect(cn As ADODB.Connection)
    cn.Open "filedsn=" & App.Path & "\Omas.dsn"
End Sub

Public Function Em(cString As String)
    Em = (Len(Trim(cString)) = 0)
End Function

Public Function FullTrim(cString As String)
    cChar = Right(cString, 1)
    Do While cChar = Chr(13) Or cChar = Chr(10) Or cChar = " "
        cString = Left(cString, Len(cString) - 1)
        cChar = Right(cString, 1)
    Loop
    FullTrim = cString
End Function

Public Sub CloseCn(cn As Object)
    If TypeName(cn) = "Connection" Then
        If cn.State = adStateOpen Then
            cn.Close
        End If
    End If
End Sub

Public Sub CloseRs(rs As Object)
    If TypeName(rs) = "RecordSet" Then
        If rs.State = adStateOpen Then
            rs.Close
        End If
    End If
End Sub

Public Function Shorten(cText As String, cLen As Integer)
    Dim aText() As String
    Dim nText As String
    
    aText = Split(cText, " ")
    
    If UBound(aText) < (cLen - 1) Then
        cLen = UBound(aText) + 1
    End If
    nText = ""
    For nI = 0 To (cLen - 1)
        nText = nText & aText(nI) & " "
    Next
    
    Shorten = nText
End Function

Function StripHTML(ByVal myString As String)
    Dim NewString As String
    Dim Char As String
    Dim StrLen As Integer
    Dim i, j As Integer
    Dim Skip As Integer
    
    StrLen = Len(myString)
    NewString = ""
    For i = 1 To StrLen
        Char = Mid(myString, i, 1)
        If Char = "<" Then
            Skip = 0
            j = i
            Do While Char <> ">" And j + Skip <= StrLen
                NewString = NewString & ""
                Char = Mid(myString, j + Skip, 1)
                Skip = Skip + 1
            Loop
            i = i + Skip - 1
        Else
            NewString = NewString + Char
        End If
    Next
    StripHTML = NewString
End Function

Function SearchString(ByVal cString As String) As String
    Dim cRet As String
    Dim cWord As String
    Dim cChar As String
    Dim lInQuotes As Boolean
    Dim nI As Integer
    
    cRet = ""
    
    lInQuotes = False
    cWord = ""
    For nI = 1 To Len(cString)
        cChar = Mid(cString, nI, 1)
        Select Case cChar
            Case Chr(34)
                If lInQuotes Then
                    ' end of quoted string
                    lInQuotes = False
                    If Not Em(cWord) Then
                        cRet = cRet & Chr(34) & cWord & Chr(34) & " AND "
                    End If
                    cWord = ""
                Else
                    ' beginning of quoted string
                    lInQuotes = True
                    cWord = ""
                End If
            Case Chr(32)
                If lInQuotes Then
                    ' embedded space in quoted string
                    cWord = cWord & cChar
                Else
                    ' space delimiting two words
                    If Not Em(cWord) Then
                        cRet = cRet & Chr(34) & cWord & Chr(34) & " AND "
                    End If
                    cWord = ""
                End If
            Case Else
                cWord = cWord & cChar
        End Select
    Next

    ' grab last word
    If Not Em(cWord) Then
        cRet = cRet & Chr(34) & cWord & Chr(34) & " "
    End If

    ' strip trailing "and"
    cRet = Trim(cRet)
    If Right(cRet, 3) = "AND" Then
        cRet = Left(cRet, Len(cRet) - 3)
    End If

    SearchString = Trim(cRet)
End Function

Public Function PadR(cString As String, cLength As Integer)
    PadR = Left(cString & Space(cLength), cLength)
End Function

Public Function Checkbox(cCheck As String) As Integer
    If Em(cCheck) Then
        Checkbox = 0
    Else
        Checkbox = CInt(cCheck)
    End If
End Function

Public Function Coalesce(cString1 As String, cString2 As String) As String
    If Em(cString1) Or IsNull(cString1) Then
        Coalesce = cString2
    Else
        Coalesce = cString1
    End If
End Function

Public Function GetRSError() As ADODB.Recordset
    Dim rs As New ADODB.Recordset
    
    rs.CursorLocation = adUseClient
    rs.Fields.Append "ERR", adVarChar, 200
    rs.Open
    rs.AddNew "ERR", Err.Description & " in " & Err.Source
    
    Set GetRSError = rs
End Function

