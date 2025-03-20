using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        // Sample input from the problem statement
        string input = Console.ReadLine();
        
        // Parse the input into a list of rates and values
        var matrix = ParseInput(input);

        // Generate HTML table
        string htmlTable = GenerateHtmlTable(matrix);

        // Output the HTML table (you can display or save this as per the requirement)
        Console.WriteLine(htmlTable);
    }

    // Method to parse the input string into a two-dimensional list
    static List<List<string>> ParseInput(string input)
    {
        List<List<string>> matrix = new List<List<string>>();

        // Split by the semicolon (:) to get each rate
        string[] rates = input.Split(';');

        foreach (var rate in rates)
        {
            if (!string.IsNullOrWhiteSpace(rate))
            {
                var row = new List<string>();
                string[] values = rate.Split(',');

                // Add values to the row
                foreach (var value in values)
                {
                    row.Add(value.Trim());
                }

                // Add the row to the matrix
                matrix.Add(row);
            }
        }

        return matrix;
    }

    // Method to generate HTML table from the matrix
    static string GenerateHtmlTable(List<List<string>> matrix)
    {
        string htmlTable = "<html><body><table border='1'><tr>";

        // Assuming the first row contains the headers (Lock1, Lock2, etc.)
        for (int i = 1; i <= matrix[0].Count; i++)
        {
            htmlTable += $"<th>Lock{i}</th>";
        }
        htmlTable += "</tr>";

        // Add the rows for values
        foreach (var row in matrix)
        {
            htmlTable += "<tr>";
            foreach (var cell in row)
            {
                htmlTable += $"<td>{cell}</td>";
            }
            htmlTable += "</tr>";
        }

        htmlTable += "</table></body></html>";

        return htmlTable;
    }
}
