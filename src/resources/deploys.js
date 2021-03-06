import React from 'react'
import PropTypes from 'prop-types'
import {
  List, Create, Edit, Filter,
  SimpleForm, required,
  TextInput,
  Datagrid,
  TextField,
  ReferenceField,
  SelectField,
  DateField,
  EditButton,
  DateInput,
  ReferenceInput,
  NumberInput,
  SelectInput
} from 'react-admin'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  wide: {
    width: '45%',
    minWidth: '251px'
  }
})

const DeployProjectFilter = (props) => (
  <Filter {...props}>
    <TextInput label='Name' source='name' />
    <TextInput label='Full name' source='fullName' />
  </Filter>
)

export const DeployProjectList = props => (
  <List {...props} title='Deploy projects' filters={<DeployProjectFilter />}>
    <Datagrid rowClick='edit'>
      <TextField source='caption' label='Repo' />
      <TextField source='fullName' label='Full repo' />
      <TextField source='branch' label='Branch' />
      <TextField source='site' label='Site' />
    </Datagrid>
  </List>
)

const DeployProjectForm = (props) => {
  const classes = useStyles()

  return (
    <SimpleForm {... props}>
      <TextInput source='id' label='Id' disabled className={classes.wide} />
      <TextInput source='name' label='Repo' validate={required()} />
      <TextInput source='fullName' label='Full repo' className={classes.wide} validate={required()} />
      <TextInput source='script' label='Script' className={classes.wide} validate={required()} />
      <NumberInput source='scriptTimeout' label='Script timeout' />
      <TextInput source='branch' label='Branch' className={classes.wide} validate={required()} />
      <TextInput source='site' label='Site' className={classes.wide} />
      <TextInput source='siteConfigPath' label='Site config path' className={classes.wide} />
      <TextInput source='siteConfig' label='Site config' fullWidth multiline />
    </SimpleForm>
  )
}

export const DeployProjectCreate = (props) => (
  <Create {...props}>
    <DeployProjectForm />
  </Create>
)

const DeployProjectEditTitle = ({ record }) => {
  return <span>Deploy Project {record ? `"${record.name}"` : ''}</span>
}

DeployProjectEditTitle.propTypes = {
  record: PropTypes.shape({
    name: PropTypes.string
  })
}

export const DeployProjectEdit = props => (
  <Edit title={<DeployProjectEditTitle />} {...props}>
    <DeployProjectForm />
  </Edit>
)

// ------- EVENT ---------
const DeployEventTypes = [
  { id: 0, name: '(unknown)' },
  { id: 1, name: '(ERROR)' },
  { id: 2, name: 'Github' },
  { id: 3, name: 'Webhook' }
]

const FullNameField = ({ record }) => <span>{record.name} ({record.branch})</span>

FullNameField.propTypes = {
  record: PropTypes.shape({
    name: PropTypes.string,
    branch: PropTypes.string
  })
}

export const DeployEventList = props => (
  <List
    {...props}
    title='Deploy events'
    filters={<DeployProjectFilter />}
    sort={{ field: 'createdAt', order: 'DESC' }}
  >
    <Datagrid rowClick='edit'>
      <DateField source='createdAt' label='CreatedAt' />
      <TextField source='status' label='Status' />
      <SelectField source='type' choices={DeployEventTypes} />
      <TextField source='caption' label='Caption' />
      <TextField source='commit' label='Commit' />
      <TextField source='branch' label='Branch' />
      <ReferenceField label='Project:' source='projectId' reference='DeployProject'>
        <TextField source='name' optionText={<FullNameField />} optionValue='id' />
      </ReferenceField>
      <EditButton />
    </Datagrid>
  </List>
)

const DeployProjectEventTitle = ({ record }) => {
  return <span>Deploy event {record ? `"${record.caption}"` : ''}</span>
}

DeployProjectEventTitle.propTypes = {
  record: PropTypes.shape({
    caption: PropTypes.string
  })
}

export const DeployEventEdit = props => {
  const classes = useStyles()

  return (
    <Edit title={<DeployProjectEventTitle />} {...props}>
      <SimpleForm>
        <TextInput source='id' label='Id' className={classes.wide} disabled />
        <DateInput source='createdAt' />
        <TextInput source='status' />
        <TextInput source='statusMessage' className={classes.wide} />
        <SelectInput source='type' choices={DeployEventTypes} />
        <TextInput source='caption' className={classes.wide} />
        <TextInput source='commit' className={classes.wide} />
        <TextInput source='branch' />
        <ReferenceInput label='Project' source='projectId' reference='DeployProject'>
          <SelectInput source='caption' />
        </ReferenceInput>
        <TextInput source='stdout' multiline fullWidth label='Console log:' />
        <TextInput source='stderr' multiline fullWidth label='Error log:' />
      </SimpleForm>
    </Edit>
  )
}
