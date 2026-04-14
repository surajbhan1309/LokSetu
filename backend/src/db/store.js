// In-memory data store for hackathon MVP
// This can be easily replaced with MongoDB/PostgreSQL later

class DataStore {
  constructor() {
    this.requests = [];
    this.documents = [];
    this.requestIdCounter = 1000;
    this.documentIdCounter = 1;
  }

  // Request Methods
  createRequest(requestData) {
    const request = {
      id: `REQ${this.requestIdCounter++}`,
      ...requestData,
      status: 'Submitted',
      paymentStatus: requestData.requiresPayment ? 'NOT_INITIATED' : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.requests.push(request);
    return request;
  }

  getRequestById(id) {
    return this.requests.find(req => req.id === id);
  }

  getRequestsByUserId(userId) {
    return this.requests.filter(req => req.userId === userId);
  }

  getAllRequests() {
    return this.requests;
  }

  updateRequestStatus(id, status) {
    const request = this.getRequestById(id);
    if (request) {
      request.status = status;
      request.updatedAt = new Date().toISOString();
      return request;
    }
    return null;
  }

  updatePaymentStatus(id, paymentStatus) {
    const request = this.getRequestById(id);
    if (request) {
      request.paymentStatus = paymentStatus;
      request.updatedAt = new Date().toISOString();
      // If payment successful, update request status
      if (paymentStatus === 'SUCCESS' && request.status === 'Pending Payment') {
        request.status = 'Submitted';
      }
      return request;
    }
    return null;
  }

  // Document Methods
  createDocument(documentData) {
    const document = {
      id: `DOC${this.documentIdCounter++}`,
      ...documentData,
      verified: false,
      uploadedAt: new Date().toISOString(),
    };
    this.documents.push(document);
    return document;
  }

  getDocumentById(id) {
    return this.documents.find(doc => doc.id === id);
  }

  getDocumentsByRequestId(requestId) {
    return this.documents.filter(doc => doc.requestId === requestId);
  }
}

// Export singleton instance
export default new DataStore();
