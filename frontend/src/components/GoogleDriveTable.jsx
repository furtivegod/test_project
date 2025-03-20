// src/components/GoogleDriveTable.js
import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/axios';

const GoogleDriveTable = () => {
  const [files, setFiles] = useState([]); // Store files from API
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const [totalRecords, setTotalRecords] = useState(0); // Total records count
  const [pageSize, setPageSize] = useState(10); // Number of items per page (default 10)
  const [sortColumn, setSortColumn] = useState('file_name'); // Default sort column
  const [sortDirection, setSortDirection] = useState('asc'); // Default sort direction
  const [filter, setFilter] = useState(''); // Filter input state

  // Fetch files from backend with pagination, sorting, and filtering
  const fetchFiles = async (page = 1) => {
    try {
      const response = await apiClient.get('/files', {
        params: {
          page,
          pageSize,
          sortColumn,
          sortDirection,
          filter,
        },
      });
      setFiles(response.data.files);
      setTotalPages(response.data.totalPages); // Set total pages from the response
      console.log(totalPages);
      setTotalRecords(response.data.totalRecords); // Set total records count
      console.log(totalRecords);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return; // Prevent invalid page numbers
    setPage(newPage);
  };

  // Handle sorting
  const handleSort = (column) => {
    const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(direction);
  };

  // Handle filter change
  const handleFilter = (e) => {
    setFilter(e.target.value);
    setPage(1); // Reset to page 1 when filter changes
  };

  // Handle page size change
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1); // Reset to page 1 when page size changes
  };
  const handleDownload = async (fileId) => {
    try {
      // Send the request to the backend to get the file as a blob
      const response = await apiClient.post('/download', { fileId }, { responseType: 'blob' });
      console.log(response.headers);
      // Get the filename from the 'Content-Disposition' header
      const contentDisposition = response.headers['content-disposition'];
      console.log(contentDisposition);
      const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '') // Get filename from the header
        : 'downloaded-file';
  
      // Create a link element to trigger the file download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(response.data);  // Create an object URL for the blob
      link.download = fileName; // Set the download attribute with the correct filename
      document.body.appendChild(link);  // Append the link to the DOM
      link.click();  // Trigger the download
      document.body.removeChild(link);  // Remove the link after download is triggered
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  useEffect(() => {
    fetchFiles(page);
  }, [page, sortColumn, sortDirection, filter, pageSize]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={filter}
            onChange={handleFilter}
            className="border p-2 rounded-md w-1/3"
          />
        <div className="flex space-x-2 items-center">
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border px-4 py-2 rounded-md"
          >
            <option value="10">10 rows</option>
            <option value="20">20 rows</option>
            <option value="50">50 rows</option>
            <option value="100">100 rows</option>
          </select>
          <div>
            <p>{totalRecords} records</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('file_name')}
              >
                File Name
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('modified_time')}
              >
                Modified Time
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('web_content_link')}
              >
                Download
              </th>
            </tr>
          </thead>
          <tbody className='max-h-96 overflow-y-auto text-center'>
            {files.map((file) => (
              <tr key={file.file_id} className="border-b">
                <td className="px-4 py-2">{file.file_name}</td>
                <td className="px-4 py-2">
                  {new Date(file.modified_time).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-center">
                <button
                    onClick={() => handleDownload(file.file_id)} // Trigger the download when clicked
                    className="text-blue-500 hover:underline"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div>
          <button
            className="border px-4 py-2 bg-gray-200 rounded-md"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            ← Previous
          </button>
          <span className="mx-2">
            Page {page} of {totalPages}
          </span>
          <button
            className="border px-4 py-2 bg-gray-200 rounded-md"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleDriveTable;
