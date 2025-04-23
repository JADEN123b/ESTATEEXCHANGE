import React from 'react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-8">EstateExchange Terms of Service, Policies, and User Agreement</h1>
        <div className="prose prose-green max-w-none">
          <p className="text-gray-600 italic">Last Updated: April 17th 2025</p>

          <p className="mt-4">
            Welcome to EstateExchange, the premier global real estate marketplace that revolutionizes property transactions through <strong>secure digital ownership transfers, legally-binding e-signatures, and end-to-end verified transactions</strong>. Our platform enables users to <strong>buy, sell, rent, and build properties</strong> with complete confidence in a fully digital ecosystem.
          </p>

          <p>
            By accessing or using EstateExchange, you agree to comply with these <em>Terms of Service (ToS), Privacy Policy, Payment Policy, Verification Guidelines, and Digital Ownership Transfer Protocol</em>. Please read them carefully.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By registering on EstateExchange, you acknowledge that you have read, understood, and agreed to these terms. If you do not agree, you must refrain from using our services.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">2. Platform Overview</h2>
          <p>EstateExchange is a digital real estate marketplace that connects:</p>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Buyers</strong> – Individuals or entities purchasing properties or land.</li>
            <li><strong>Sellers</strong> – Property owners or authorized agents listing real estate.</li>
            <li><strong>Renters</strong> – Tenants seeking short-term or long-term rentals.</li>
            <li><strong>Agents & Verifiers</strong> – Licensed professionals who inspect and validate property details.</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-3">Key Features:</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✅</span>
              <strong>Instant Digital Ownership Transfer</strong> – Legally-recognized property title transfers via blockchain-backed documentation.
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✅</span>
              <strong>Legally-Binding E-Signatures</strong> – Secure digital signing of contracts compliant with global e-signature laws (ESIGN, UETA, eIDAS).
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✅</span>
              <strong>Global Agent Network</strong> – Verified agents inspect properties before transactions.
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✅</span>
              <strong>Secure In-Platform Payments</strong> – All transactions must occur within EstateExchange; off-platform dealings are prohibited.
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✅</span>
              <strong>Transparent Fees</strong> – Only <strong>3% platform fee</strong> per transaction (97% to user, 3% to EstateExchange).
            </li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">3. User Responsibilities</h2>

          <h3 className="text-lg font-semibold mt-6 mb-3">A. Buyers & Renters</h3>
          <ul className="list-disc pl-6">
            <li>Must conduct <strong>due diligence</strong> before purchasing.</li>
            <li>Are responsible for <strong>agent verification fees</strong> (paid directly to agents).</li>
            <li>Must ensure payment accuracy; all transactions are final unless fraud is proven.</li>
            <li><strong>MUST NOT engage in off-platform transactions</strong>—any deals conducted outside EstateExchange are at the user's own risk, and the company bears no liability for resulting scams or losses.</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-3">B. Sellers & Landlords</h3>
          <ul className="list-disc pl-6">
            <li>Must provide <strong>accurate property details</strong> (false listings lead to penalties).</li>
            <li>Must cooperate with <strong>EstateExchange verification agents</strong>.</li>
            <li>Must not engage in <strong>fraudulent or misleading practices</strong>.</li>
            <li><strong>MUST NOT facilitate payments outside EstateExchange</strong>—violators will be banned, and listings removed.</li>
            <li>Must ensure proper <strong>digital ownership documentation</strong> is uploaded for seamless transfers.</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-3">C. Agents & Verifiers</h3>
          <ul className="list-disc pl-6">
            <li>Must be <strong>licensed professionals</strong> in their jurisdiction.</li>
            <li>Must submit <strong>detailed inspection reports</strong> with photos/videos.</li>
            <li>Will be <strong>penalized or banned</strong> for false verifications.</li>
            <li><strong>MUST NOT arrange private deals outside the platform</strong>—any such activity will result in immediate termination.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">4. Digital Ownership Transfer Policy</h2>

          <h3 className="text-lg font-semibold mt-6 mb-3">A. Process Overview</h3>
          <ol className="list-decimal pl-6">
            <li><strong>Document Verification</strong> – Seller uploads title deeds, ownership proofs, and any encumbrance certificates.</li>
            <li><strong>E-Signature Execution</strong> – Both parties sign the transfer agreement using our <strong>bank-grade encrypted e-signature system</strong>.</li>
            <li><strong>Blockchain Notarization</strong> – Transaction recorded on an immutable ledger for legal validity.</li>
            <li><strong>Instant Title Transfer</strong> – New ownership documents are digitally issued and stored in the buyer's EstateExchange vault.</li>
          </ol>

          <h3 className="text-lg font-semibold mt-6 mb-3">B. Legal Recognition</h3>
          <p>All digital transfers comply with:</p>
          <ul className="list-disc pl-6">
            <li><strong>ESIGN Act (US)</strong></li>
            <li><strong>eIDAS Regulation (EU)</strong></li>
            <li><strong>UETA (Uniform Electronic Transactions Act)</strong></li>
            <li><strong>Local real estate laws</strong> in the property's jurisdiction.</li>
          </ul>
          <p>EstateExchange provides <strong>digitally notarized certificates</strong> admissible in court.</p>

          <h3 className="text-lg font-semibold mt-6 mb-3">C. User Obligations</h3>
          <ul className="list-disc pl-6">
            <li>Sellers must warrant they have <strong>full legal rights</strong> to transfer ownership.</li>
            <li>Buyers must verify <strong>all documents match physical records</strong> before signing.</li>
            <li><strong>Disputes must be reported within 7 days</strong> of transfer completion.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">5. Fees & Payments</h2>

          <h3 className="text-lg font-semibold mt-6 mb-3">A. Transaction Fees</h3>
          <ul className="list-disc pl-6">
            <li><strong>3%</strong> of every transaction goes to <strong>EstateExchange</strong>.</li>
            <li><strong>97%</strong> is transferred to the user (seller/landlord).</li>
            <li><strong>Agent verification fees</strong> are paid separately by the buyer/renter.</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-3">B. Payment Methods</h3>
          <p>We accept:</p>
          <ul className="list-disc pl-6">
            <li>Credit/Debit Cards</li>
            <li>Bank Transfers</li>
            <li>Cryptocurrency (BTC, ETH, USDT)</li>
            <li>Escrow Services (for high-value transactions)</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-3">C. Refund Policy</h3>
          <ul className="list-disc pl-6">
            <li>Refunds are only issued in cases of <strong>proven fraud</strong> or misrepresentation.</li>
            <li>Verification fees are <strong>non-refundable</strong> once the agent has performed the inspection.</li>
            <li><strong>No refunds or protections apply to off-platform transactions</strong>—users engaging in private deals do so at their own risk.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">6. Property Verification Process</h2>
          <p>To ensure security, all properties undergo:</p>
          <ol className="list-decimal pl-6">
            <li><strong>Document Check</strong> (Title Deeds, Ownership Proof)</li>
            <li><strong>Physical Inspection</strong> (Agents visit the property)</li>
            <li><strong>Virtual Tour Upload</strong> (For remote buyers)</li>
            <li><strong>Approval & Listing</strong> (Only verified properties go live)</li>
          </ol>

          <h2 className="text-xl font-bold mt-8 mb-4">7. Dispute Resolution</h2>
          <ul className="list-disc pl-6">
            <li>All disputes must be reported within <strong>7 days</strong> of transaction completion.</li>
            <li>EstateExchange will mediate but <strong>does not guarantee refunds</strong>.</li>
            <li><strong>Off-platform disputes are not supported</strong>—users who bypass EstateExchange forfeit all protections.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">8. Privacy & Data Security</h2>
          <p>We adhere to <strong>GDPR, CCPA, and global data protection laws</strong>.</p>
          <ul className="list-disc pl-6">
            <li>User data is <strong>encrypted</strong> and never sold.</li>
            <li>Agents only receive necessary details for verification.</li>
            <li>Users can <strong>delete their accounts</strong> at any time.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">9. Prohibited Activities</h2>
          <ul className="list-disc pl-6">
            <li>🚫 <strong>Fraudulent listings</strong> (fake properties, scams)</li>
            <li>🚫 <strong>Money laundering</strong> (suspicious transactions will be frozen)</li>
            <li>🚫 <strong>Unauthorized agent impersonation</strong></li>
            <li>🚫 <strong>Spam or phishing attempts</strong></li>
            <li>🚫 <strong>Off-platform transactions</strong>—any attempt to move payments outside EstateExchange will result in <strong>account suspension, legal action, or permanent bans</strong></li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">10. Limitation of Liability</h2>
          <p>EstateExchange is <strong>not liable</strong> for:</p>
          <ul className="list-disc pl-6">
            <li><strong>Agent misconduct</strong> (users must verify credentials)</li>
            <li><strong>Market fluctuations</strong> in property value</li>
            <li><strong>Internet fraud</strong> outside our platform</li>
            <li><strong>Scams resulting from off-platform dealings</strong>—users who transact privately assume full risk</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">11. Amendments to Terms</h2>
          <p>We may update these terms periodically. Users will be notified via <strong>email or in-app alerts</strong>. Continued use constitutes acceptance.</p>

          <h2 className="text-xl font-bold mt-8 mb-4">12. Contact & Support</h2>
          <p>For inquiries, contact:</p>
          <ul className="list-none space-y-2">
            <li>📧 <strong>Email:</strong> support@estateexchange.com</li>
            <li>🌐 <strong>Website:</strong> <a href="https://www.estateexchange.estate" className="text-green-600 hover:text-green-500">www.estateexchange.com</a></li>
            <li>📞 <strong>Hotline:</strong> +237677145024</li>
          </ul>

          <h3 className="text-lg font-semibold mt-8 mb-4">Why EstateExchange Stands Out?</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✔</span>
              <strong>Instant Digital Ownership Transfers</strong> – No paperwork, no delays.
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✔</span>
              <strong>Court-Admissible E-Signatures</strong> – Legally binding in 180+ countries.
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✔</span>
              <strong>Strict In-Platform Transactions Only</strong> – No off-platform deals; full security.
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✔</span>
              <strong>Lower Fees</strong> – Only 3% per transaction (competitors charge 5-10%).
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✔</span>
              <strong>Global Reach</strong> – Buy/sell properties anywhere, anytime.
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✔</span>
              <strong>Zero Scam Policy</strong> – Strict verification prevents fraud.
            </li>
          </ul>

          <div className="text-center mt-8">
            <h3 className="text-xl font-bold text-green-600">Join EstateExchange Today – Where Real Estate Meets the Digital Future! 🏡💻</h3>
          </div>

          <div className="mt-8 pt-8 border-t">
            <p className="text-center text-gray-600">© 2024 EstateExchange. All Rights Reserved.</p>
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Final Notes:</h3>
            <ul className="space-y-2">
              <li>• <strong>All transactions MUST stay within EstateExchange</strong>—no exceptions.</li>
              <li>• <strong>97% to users, 3% to platform</strong>—clear, fair pricing.</li>
              <li>• <strong>Digital ownership transfers are legally binding</strong>—fully compliant with international e-signature laws.</li>
              <li>• <strong>Off-platform dealings = No protection</strong>—we will not assist in resolving external scams.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms; 