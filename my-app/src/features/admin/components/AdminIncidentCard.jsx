const AdminIncidentCard = ({ incident }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-3 mt-3 bg-white">
      <h1>{incident.summary}</h1>
      <p>{incident.description}</p>
      <p>{incident.registration_date}</p>
      <p>{incident.category_name}</p>
      <p>{incident.state_name}</p>
    </div>
  )
}

export default AdminIncidentCard